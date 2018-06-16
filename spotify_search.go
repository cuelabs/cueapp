package main 

import (
  "github.com/mattcarpowich1/cueapp/models"
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

    fmt.Println(q.SUID)
    fmt.Println(q.Query)
    
    w.WriteHeader(http.StatusOK)
  }
  return fn
}