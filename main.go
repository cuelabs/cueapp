package main  

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/controllers"
  "github.com/mattcarpowich1/cueapp/models"
  "github.com/gorilla/handlers"
  "github.com/zmb3/spotify"
  "github.com/gorilla/mux"
  "github.com/rs/cors"
  _ "github.com/lib/pq"
  "os"
  "fmt"
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

//heroku
var PORT = os.Getenv("PORT")

const (
  clientID  = "2a437f62902142b78efdcbaab0b95271"
  secretKey = "35e6b3b0f37846debfbf21d15ab01073"
)

var (
  err error
)

var S = SpotifyHub{
  clients: make(map[string]map[*spotify.Client]bool),
  register: make(chan *spotifySubscription),
}


func main() {
  models.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  // controllers.S = S

  Auth.SetAuthInfo(clientID, secretKey)
  url := Auth.AuthURL(State)

  go h.run()
  go S.run()

  router := mux.NewRouter()
  
  // Events API 
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents(models.DBCon)).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser(models.DBCon)).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser(models.DBCon)).Methods("POST")

  // Spotify API
  router.HandleFunc("/spotify/search", Search(&S)).Methods("POST")

  // Auth 
  router.HandleFunc("/login", redirect(url))
  router.HandleFunc("/callback", CompleteAuth(models.DBCon))
  // router.HandleFunc("/completeLogin/{suid:[0-9]+}", finishLogin)
  // router.HandleFunc("/test/{suid:[0-9]+}", doTest)

  // User Home Page
  router.HandleFunc("/user/{suid:[0-9]+}", homePage)

  // Websocket
  router.HandleFunc("/ws", serveWs(models.DBCon))

  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  http.Handle("/user/{suid:[a-zA-Z0-9]+}", http.StripPrefix("/user/{suid:[0-9]+}", http.FileServer(http.Dir("./client/build"))))
  handler := cors.Default().Handler(router)
  http.ListenAndServe(":" + PORT, handlers.LoggingHandler(os.Stdout, handler))
}

func redirect(url string) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, url, 301)
  }
  return fn
}

func Search(h *SpotifyHub) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("hey")
  }
  return fn
}

func homePage(w http.ResponseWriter, r *http.Request) {
  // http.FileServer(http.Dir("./client/build"))
  http.ServeFile(w, r, "./client/build/index.html")
}

// func finishLogin(w http.ResponseWriter, r *http.Request) {
//   fmt.Printf("%+v\n", r)
//   fmt.Printf("%+v\n", w)
//   fmt.Println(r.Header.Get("something"))
// }

// func doTest(w http.ResponseWriter, r *http.Request) {
//   id := mux.Vars(r)["suid"]
//   r.Header.Set("something", "somestring")
//   http.Redirect(w, r, "/completeLogin/" + id, 301)
// }
