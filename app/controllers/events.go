package controllers 

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "fmt"
  "github.com/mattcarpowich1/cueapp/app/db"
)

var (
  event db.Event
  eventId db.EventID
  err error
)

func CreateEvent(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("hello")
    err = json.NewDecoder(r.Body).Decode(&event)
    if err != nil {
      panic(err)
    }

    fmt.Println(event)

    rightNow := time.Now()

    event.CreatedAt = rightNow
    event.UpdatedAt = rightNow

    err, eventId.ID = db.InsertEvent(dbCon, &event)
    if err != nil {
      panic(err)
    }

    eventIdJson, err := json.Marshal(eventId)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(eventIdJson)
  }

  return fn
}