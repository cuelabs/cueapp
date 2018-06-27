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

//heroku only
const (
  clientID  = "2a437f62902142b78efdcbaab0b95271"
  secretKey = "35e6b3b0f37846debfbf21d15ab01073"
)

var (
  err error
)

//heroku only
var S = SpotifyHub{
  clients: make(map[string]*spotify.Client),
  register: make(chan *spotifySubscription),
}


func main() {
  models.DBCon, err = sql.Open("postgres", connectionString)
  if err != nil {
    panic(err)
  }

  //heroku only
  Auth.SetAuthInfo(clientID, secretKey)
  url := Auth.AuthURL(State)

  go h.run()
  //heroku only
  go S.run()

  router := mux.NewRouter()
  
  // Events API 
  router.HandleFunc("/events/read/all", controllers.ReadAllEvents).Methods("GET")
  router.HandleFunc("/events/read/one", controllers.ReadOneEvent).Methods("POST")
  router.HandleFunc("/events/create", controllers.CreateEvent).Methods("POST")
  router.HandleFunc("/events/guests", controllers.ReadAllUsersEvent).Methods("POST")
  router.HandleFunc("/users/create", controllers.CreateUser).Methods("POST")
  router.HandleFunc("/users/load", controllers.LoadUser).Methods("POST")

  // Cue API
  router.HandleFunc("/cue/track/add", controllers.AddTrackToCue).Methods("POST")
  router.HandleFunc("/cue/track/read", controllers.ReadNextTrackFromCue).Methods("POST")

  // Spotify API (heroku only)
  router.HandleFunc("/spotify/search", Search(&S)).Methods("POST")

  // Auth 
  //heroku only
  router.HandleFunc("/login", redirect(url))
  router.HandleFunc("/callback", CompleteAuth(models.DBCon))

  // User Home Page
  router.HandleFunc("/user/{suid:[a-zA-Z0-9]+}", homePage)

  // Websocket
  router.HandleFunc("/ws", serveWs)

  router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
  http.FileServer(http.Dir("./client/build"))
  http.Handle("/", router)
  http.Handle("/user/{suid:[a-zA-Z0-9]+}", http.StripPrefix("/user/{suid:[a-zA-Z0-9]+}", http.FileServer(http.Dir("./client/build"))))
  handler := cors.Default().Handler(router)
  http.ListenAndServe(":" + PORT, handlers.LoggingHandler(os.Stdout, handler))
}

func redirect(url string) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, url, 301)
  }
  return fn
}

func homePage(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, "./client/build/index.html")
}
