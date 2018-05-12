package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/app/controllers"
  "github.com/mattcarpowich1/cueapp/app/models"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  "github.com/gorilla/websocket"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "os"
  "log"
  // "fmt"
)

const connectionString = `
  user=matthewcarpowich
  dbname=cuetestdb
  sslmode=disable`

var Clients = make(map[*websocket.Conn]bool) // connected clients
var Broadcast = make(chan JoinRequest)      // broadcast channel
var upgrader = websocket.Upgrader{}
var err error

type JoinRequest struct {
  UserID    int `json:"user_id"`
  Username string `json:"username"`
  EventID int `json:"event_id"`
  IsAccept bool `json:"is_accept"`
  IsReject bool `json:"is_reject"`
  IsEndEvent bool `json:"is_end_event"`
}

func main() {
  models.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  go handleMessages()

  router := mux.NewRouter()
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(models.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/ws", handleConnections(models.DBCon))
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, handler))
}

func handleConnections(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    // Upgrade initial GET request to a websocket
    r.Header["Origin"] = nil
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
      log.Fatal(err)
    }
    // Make sure we close the connection when the function returns
    defer ws.Close()

    // Register our new client
    Clients[ws] = true

    for {
      var jreq JoinRequest
      // Read in a new message as JSON and map it to a Message object
      err := ws.ReadJSON(&jreq)
      if err != nil {
        log.Printf("error: %v", err)
        delete(Clients, ws)
        break
      }
      if jreq.IsAccept != true && jreq.IsReject != true {
        if jreq.IsEndEvent != true {
          err = models.JoinEventUser(dbCon, jreq.EventID, jreq.UserID)
        } else {
          err = models.DeactivateAllUsersAtEvent(dbCon, jreq.EventID)
          if err != nil {
            panic(err)
          }
          err = models.DeactivateEvent(dbCon, jreq.EventID)
        }
      } else {
        if jreq.IsAccept == true {
          err = models.ActivateUser(dbCon, jreq.UserID)
        } else if jreq.IsReject == true {
          err = models.DeleteEventUser(dbCon, jreq.EventID, jreq.UserID)
          if err != nil {
            panic(err)
          }
          err = models.DeactivateUser(dbCon, jreq.UserID)
        }
      }
      
      if err != nil {
        panic(err)
      }
      // Send the newly received message to the broadcast channel
      Broadcast <- jreq
    }
  }
  return fn
}

func handleMessages() {
  for {
    // Grab the next message from the broadcast channel
    msg := <-Broadcast
    // Send it out to every client that is currently connected
    for client := range Clients {
      // fmt.Println(msg.Username)
      err := client.WriteJSON(msg)
      if err != nil {
        log.Printf("error: %v", err)
        client.Close()
        delete(Clients, client)
      }
    }
  }
}

