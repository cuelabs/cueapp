package main

import (
  "fmt"
  "log"
  "net/http"
  "github.com/zmb3/spotify"
  "github.com/mattcarpowich1/cueapp/models"
  "database/sql"
  "time"
)

const redirectURI = "https://arcane-tundra-63613.herokuapp.com/callback"

var (
  Auth      = spotify.NewAuthenticator(redirectURI, spotify.ScopeUserReadPrivate)
  Ch        = make(chan *spotify.Client)
  State     = "abc1234"
  id      models.User
  err2    error
)

func CompleteAuth(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
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
    user, err3 := client.CurrentUser()
    if err3 != nil {
      log.Fatal(err3)
    }

    // fmt.Println("User ID:", user.ID)
    // fmt.Println("Display name:", user.DisplayName)
    // fmt.Println("Spotify URI:", string(user.URI))
    // fmt.Println("Endpoint:", user.Endpoint)
    // fmt.Println("Image link: ", user.Images[0].URL)

    // check if authenticated user exists in db
    u, err4 := models.FindUserBySUID(dbCon, user.ID)
    if err4 != nil {
      panic(err)
    }
    if u.SUID == user.ID {
      fmt.Println("Found user with display name: " + u.DisplayName)
    }  else {
      // insert new user in the database with the authenticated users SUID
      newUser := models.NewSpotifyUser{
        SUID: user.ID,
        DisplayName: user.DisplayName,
        DisplayImage: user.Images[0].URL,
        CreatedAt: time.Now(),
      }
      newUserInfo, err := models.InsertSpotifyUser(dbCon, &newUser)
      if err != nil {
        panic(err)
      }
      fmt.Println("added new user with id: " + newUserInfo.SUID)
    }

    Ch <- &client
  }
  return fn
}
