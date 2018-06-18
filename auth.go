 package main

import (
  "log"
  "net/http"
  "github.com/zmb3/spotify"
  "github.com/mattcarpowich1/cueapp/models"
  "database/sql"
  "time"
  "fmt"
)

const redirectURI = "https://arcane-tundra-63613.herokuapp.com/callback"

var (
  Auth      = spotify.NewAuthenticator(redirectURI, spotify.ScopeUserReadPrivate)
  State     = "abc1234"
  id        models.User
  err2      error
  u         models.SpotifyUserData
)

func CompleteAuth(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    tok, err := Auth.Token(State, r)
    if err != nil {
      http.Error(w, "Couldn't get token", http.StatusForbidden)
      log.Fatal(err)
      return
    }
    if st := r.FormValue("state"); st != State {
      http.NotFound(w, r)
      log.Fatalf("State mismatch: %s != %s\n", st, State)
      return
    }

    // Use the token to get an authenticated client
    client := Auth.NewClient(tok)
    user, err3 := client.CurrentUser()
    if err3 != nil {
      log.Fatal(err3)
      return
    }

    fmt.Println("token")
    fmt.Println(tok.AccessToken)

    // Check if authenticated user exists in DB
    u, err4 := models.FindUserBySUID(dbCon, user.ID)
    if err4 != nil {
      panic(err4)
      return
    }

    if u.ID > 0 {
      // heroku only
      sub := &spotifySubscription{client: &client, suid: user.ID}
      S.register <- sub
    }  else {
      // Insert new user in the database with the authenticated users SUID
      newUser := models.NewSpotifyUser{
        SUID: user.ID,
        DisplayName: user.DisplayName,
        DisplayImage: user.Images[0].URL,
        CreatedAt: time.Now(),
      }

      _, err := models.InsertSpotifyUser(dbCon, &newUser)
      if err != nil {
        panic(err)
        return
      }

      // Send client to spotifyHub
      sub := &spotifySubscription{client: &client, suid: user.ID}
      S.register <- sub
    }

    http.Redirect(w, r, ("/user/" + user.ID), 301)
  }
  return fn
}
