package auth 

import (
  "fmt"
  "log"
  "net/http"
  "encoding/json"
  "github.com/zmb3/spotify"
  "github.com/mattcarpowich1/cueapp/models"
  "strconv"
)

const redirectURI = "https://arcane-tundra-63613.herokuapp.com/callback"

// os.Setenv("SPOTIFY_ID", "2a437f62902142b78efdcbaab0b95271")
// os.Setenv("SPOTIFY_SECRET", "35e6b3b0f37846debfbf21d15ab01073")

var (
  Auth      = spotify.NewAuthenticator(redirectURI, spotify.ScopeUserReadPrivate)
  Ch        = make(chan *spotify.Client)
  State     = "abc123"
  Connected = false
  id      models.User
  err2    error
)



func CompleteAuth(w http.ResponseWriter, r *http.Request) {
  tok, err := Auth.Token(State, r)
  if err != nil {
    http.Error(w, "Couldn't get token", http.StatusForbidden)
    log.Fatal(err)
  }
  if st := r.FormValue("state"); st != State {
    http.NotFound(w, r)
    log.Fatalf("State mismatch: %s != %s\n", st, State)
  }
  // use the token to get an authenticated client
  client := Auth.NewClient(tok)
  fmt.Fprintf(w, "Login Completed!")
  Ch <- &client
  // tok, err := Auth.Token(State, r)
  // if err != nil {
  //   http.Error(w, "Couldn't get token", http.StatusForbidden)
  //   log.Fatal(err)
  // }
  // if st := r.FormValue("state"); st != State {
  //   http.NotFound(w, r)
  //   log.Fatalf("State mistmatch: %s != %s\n", st, State)
  // }
  // client := Auth.NewClient(tok)
  // fmt.Fprintf(w, "Login Completed!")
  // Connected = true

  // u, err := client.CurrentUser()
  // if err != nil {
  //   log.Fatal(err)
  // }
  // // fmt.Println("You are logged in as:", user.ID)
  // id.Uid = strconv.Atoi(user.ID)
  // uidJson, err := json.Marshal(id)
  // if err != nil {
  //   panic(err)
  // }

  // w.Header().Set("Content-Type", "application/json")
  // w.Header().Set("Access-Control-Allow-Origin", "*")
  // w.WriteHeader(http.StatusOK)
  // w.Write(uidJson)

  // Ch <- &client

  http.Redirect(w, r, "/home", 301)
  // http.FileServer(http.Dir("./client/build"))
}

func PrintSomething(client *spotify.Client) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    u, err := client.CurrentUser()
    if err != nil {
      log.Fatal(err)
    }
    // fmt.Println("You are logged in as:", user.ID)
    id.Uid, err = strconv.Atoi(u.ID)
    uidJson, err := json.Marshal(id)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
    w.Write(uidJson)
  }
  return fn
}

