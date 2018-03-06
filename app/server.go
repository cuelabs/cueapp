package main  

import (
  "net/http"
  "os"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/app/controllers"
  "github.com/mattcarpowich1/cueapp/app/db"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  _ "github.com/lib/pq"
)

const connectionString = `
  user=matthewcarpowich
  dbname=cuetestdb
  sslmode=disable`

func main() {
  var err error

  db.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  router := mux.NewRouter()
  router.HandleFunc("/events/create", controllers.CreateEvent(db.DBCon)).Methods("POST")
  http.Handle("/", router)
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, router))
}