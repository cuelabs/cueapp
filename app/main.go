package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/app/controllers"
  "github.com/mattcarpowich1/cueapp/app/models"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  // "github.com/gorilla/websocket"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "os"
  // "log"
  // "encoding/json"
  // "fmt"
)

const connectionString = `
  user=matthewcarpowich
  dbname=cuetestdb
  sslmode=disable`

// var Clients = make(map[*websocket.Conn]bool) // connected clients
// var Broadcast = make(chan JoinRequest)      // broadcast channel
// var upgrader = websocket.Upgrader{}
var err error

// type JoinRequest struct {
//   UserID    int `json:"user_id"`
//   Username string `json:"username"`
//   EventID int `json:"event_id"`
//   IsAccept bool `json:"is_accept"`
//   IsReject bool `json:"is_reject"`
//   IsEndEvent bool `json:"is_end_event"`
// }

func main() {
  models.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  go h.run()

  router := mux.NewRouter()
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(models.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/ws", serveWs)
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, handler))
}

