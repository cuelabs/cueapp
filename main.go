package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/controllers"
  "github.com/mattcarpowich1/cueapp/models"
  "github.com/mattcarpowich1/cueapp/auth"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "github.com/zmb3/spotify"
  "os"
  "fmt"
  // "log"
)

// dev
// const connectionString = `
//   user=matthewcarpowich
//   dbname=cuetestdb
//   sslmode=disable`

// heroku
var connectionString = os.Getenv("DATABASE_URL")

//dev
// const PORT = "8080"

//test 
// const authUrl="https://mattcarpowich.io"

//heroku
var PORT = os.Getenv("PORT")

const (
  clientID  = "2a437f62902142b78efdcbaab0b95271"
  secretKey = "35e6b3b0f37846debfbf21d15ab01073"
)

var (
  err error
  Client *spotify.Client
)


func main() {
  models.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  // os.Setenv("SPOTIFY_ID", "2a437f62902142b78efdcbaab0b95271")
  // os.Setenv("SPOTIFY_SECRET", "35e6b3b0f37846debfbf21d15ab01073")
  auth.Auth.SetAuthInfo(clientID, secretKey)

  url := auth.Auth.AuthURL(auth.State)
  fmt.Println("Please log in to Spotify by visiting the following page in your browser:", url)

  // user, err2 := client.CurrentUser()
  // if err2 != nil {
  //   log.Fatal(err2)
  // }
  // fmt.Println("You are logged in as:", user.ID)
  fmt.Println("Hello From Go")
  fmt.Println(url)

  go h.run()

  // Client := <- auth.Ch

  // router := mux.NewRouter()
  // router.HandleFunc("/events/read/all", controllers.ReadAllEvents(models.DBCon)).Methods("GET")
  // // router.HandleFunc("/api", auth.PrintSomething(Client)).Methods("GET")
  // router.HandleFunc("/events/read/one", controllers.ReadOneEvent(models.DBCon)).Methods("POST")
  // router.HandleFunc("/events/create", controllers.CreateEvent(models.DBCon)).Methods("POST")
  // router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent(models.DBCon)).Methods("POST")
  // router.HandleFunc("/users/create", controllers.CreateUser(models.DBCon)).Methods("POST")
  // router.HandleFunc("/users/load", controllers.LoadUser(models.DBCon)).Methods("POST")
  // router.HandleFunc("/callback", auth.CompleteAuth)
  // //   Queries("code", "{code}", "state", "{state}").Methods("GET")
  // // http.HandleFunc("/callback", auth.CompleteAuth)
  // router.HandleFunc("/ws", serveWs(models.DBCon))
  // router.PathPrefix("/app").Handler(http.FileServer(http.Dir("./client/build")))
  // router.HandleFunc("/", redirect(url))
  // // router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  // // http.FileServer(http.Dir("./client/build"))
  // http.Handle("/", router)
  // handler := cors.Default().Handler(router)
  // go http.ListenAndServe(":" + PORT, handlers.LoggingHandler(os.Stdout, handler))

  router := mux.NewRouter()
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(models.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/callback", auth.CompleteAuth)
  router.HandleFunc("/loginComplete", loginComplete(Client))
  router.HandleFunc("/login", redirect(url))
  router.HandleFunc("/ws", serveWs(models.DBCon))
  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  handler := cors.Default().Handler(router)
  go http.ListenAndServe(":" + PORT, handlers.LoggingHandler(os.Stdout, handler))

  fmt.Println("here we are")

  Client := <- auth.Ch
  fmt.Println("client here")
  fmt.Println(Client)
}

func redirect(url string) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, url, 301)
  }
  return fn
}

func loginComplete(c *spotify.Client) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("are we there?")
    http.FileServer(http.Dir("./client/build"))
    http.ServeFile(w, r, ".loginComplete.html")
  }
  return fn
}

