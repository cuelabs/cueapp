package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/app/controllers"
  "github.com/mattcarpowich1/cueapp/app/db"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  "github.com/gorilla/websocket"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "os"
  "log"
  "fmt"
)

const connectionString = `
  user=matthewcarpowich
  dbname=cuetestdb
  sslmode=disable`

var Clients = make(map[*websocket.Conn]bool) // connected clients
var Broadcast = make(chan JoinRequest)      // broadcast channel
var upgrader = websocket.Upgrader{}

type JoinRequest struct {
  UserID    int `json:"user_id"`
  Username string `json:"username"`
}

func main() {
  var err error

  db.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  // Start listening for incoming chat messages
  go handleMessages()

  router := mux.NewRouter()
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(db.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(db.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(db.DBCon)).Methods("POST")
  router.HandleFunc("/events/request", controllers.JoinEventRequest(db.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(db.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(db.DBCon)).Methods("POST")
  router.HandleFunc("/ws", handleConnections)
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, handler))
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
  // Upgrade initial GET request to a websocket
  r.Header["Origin"] = nil
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Fatal(err)
  }
  // Make sure we close the connection when the function returns
  defer ws.Close()

  // Register our new client
  clients[ws] = true

  fmt.Println("oy")

  for {
    var jreq JoinRequest
    // Read in a new message as JSON and map it to a Message object
    err := ws.ReadJSON(&jreq)
    if err != nil {
      log.Printf("error: %v", err)
      delete(clients, ws)
      break
    }
    // Send the newly received message to the broadcast channel
    Broadcast <- jreq
  }
}

func handleMessages() {
  for {
    // Grab the next message from the broadcast channel
    msg := <-Broadcast
    // Send it out to every client that is currently connected
    for client := range clients {
      err := client.WriteJSON(msg)
      if err != nil {
        log.Printf("error: %v", err)
        client.Close()
        delete(clients, client)
      }
    }
  }
}

