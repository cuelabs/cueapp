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

    fmt.Println("User ID:", user.ID)
    fmt.Println("The length of the spotify user id is...", string(len(user.ID)))
    // fmt.Println("Display name:", user.DisplayName)
    // fmt.Println("Spotify URI:", string(user.URI))
    // fmt.Println("Endpoint:", user.Endpoint)
    // fmt.Println("Image link: ", user.Images[0].URL)

    // check if authenticated user exists in db
    u, err4 := models.FindUserBySUID(dbCon, user.ID)
    fmt.Println("Select just happened and u.SUID is..." + u.SUID)
    if err4 != nil {
      panic(err)
      fmt.Println("there was an error in the read")
      return
    }
    fmt.Println("The length of the spotify user id is...", string(len(u.SUID)))
    if u.SUID == user.ID {
      fmt.Println("Found user with display name: " + u.DisplayName)
      return
    }  else {
      // insert new user in the database with the authenticated users SUID
      newUser := models.NewSpotifyUser{
        SUID: user.ID,
        DisplayName: user.DisplayName,
        DisplayImage: user.Images[0].URL,
        CreatedAt: time.Now(),
      }
      fmt.Println("Hopefully this does not print")
      newUserInfo, err := models.InsertSpotifyUser(dbCon, &newUser)
      if err != nil {
        panic(err)
        return
      }
      fmt.Println("added new user with id: " + newUserInfo.SUID)
      fmt.Println("length of new user id is..." + string(len(newUserInfo.SUID)))
    }

    Ch <- &client
  }
  return fn
}
