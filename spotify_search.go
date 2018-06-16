package main 

import (
  "github.com/mattcarpowich1/cueapp/models"
  "github.com/zmb3/spotify"
  "net/http"
  "encoding/json"
  "fmt"
)

var q models.SearchQuery

func Search(h *SpotifyHub) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("hello?")
    err := json.NewDecoder(r.Body).Decode(&q)
    if err != nil {
      panic(err)
    }

    client := h.clients[q.SUID]

    result, err2 := client.Search(q.Query, spotify.SearchTypeTrack)
    if err2 != nil {
      panic(err)
    }

    searchTracksJson, err := json.Marshal(result.Tracks)
    if err != nil {
      panic(err)
    }
    
    w.WriteHeader(http.StatusOK)
    w.Write(searchTracksJson)
  }
  return fn
}