package main  

import (
  "net/http"
  "os"
  // "fmt"
  // "log"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/app/controllers"
  "github.com/mattcarpowich1/cueapp/app/db"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  "github.com/rs/cors"
  // "github.com/zmb3/spotify"
  _ "github.com/lib/pq"
)

// const redirectURI = "http://localhost:8080/callback"

// var (
//   auth  = spotify.NewAuthenticator(redirectURI, spotify.ScopeUserReadPrivate)
//   ch    = make(chan *spotify.Client)
//   state = "thisisnotajoke"
//   clientID = "4c566d09f7e341feb12b270c947287e3"
// )

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

  // auth.SetAuthInfo("4c566d09f7e341feb12b270c947287e3", "47936ca50ef74f7bae82a3dbb5360e7a")
  // url := auth.AuthURL(state)
  // fmt.Println("Please log in to Spotify by visiting the following page in your browser:", url)

  router := mux.NewRouter()
  // router.HandleFunc("/auth/code", controllers.GetAuthCode).Methods("GET")
  // router.HandleFunc("/callback", completeAuth)
  // router.HandleFunc("/login", controllers.LoginSpotify(state, url, clientID)).Methods("GET")
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(db.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(db.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(db.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(db.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(db.DBCon)).Methods("POST")
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  
  http.ListenAndServe(":8080", handlers.LoggingHandler(os.Stdout, handler))

  // client := <-ch

  // user, err := client.CurrentUser()
  // if err != nil {
  //   log.Fatal(err)
  // }
  // fmt.Println("You are logged in as:", user.ID)
}

