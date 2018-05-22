package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/controllers"
  "github.com/mattcarpowich1/cueapp/models"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "os"
)

// const connectionString = `
//   user=matthewcarpowich
//   dbname=cuetestdb
//   sslmode=disable`

var err error

func main() {
  connectionString := os.Getenv("DATABASE_URL")
  // os.Setenv("PORT", "8080")
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
  router.HandleFunc("/ws", serveWs(models.DBCon))
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, handler))
}

