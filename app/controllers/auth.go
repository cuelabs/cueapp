package controllers

import (
  "net/http"
  "fmt"
)

func LoginSpotify(state string, url string, clientID string) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("fuck")
    http.Redirect(w, r, "https://google.com", 301)
  }
  return fn
}