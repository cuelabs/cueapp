package controllers 

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "github.com/mattcarpowich1/cueapp/app/db"
)

var (
  event db.Event
  events db.Events
  eventId db.EventID
  err error
)

func CreateEvent(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    err = json.NewDecoder(r.Body).Decode(&event)
    if err != nil {
      panic(err)
    }

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
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
    w.Write(eventIdJson)
  }

  return fn
}

func ReadAllEvents (dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    err, events = db.FindAllEvents(dbCon)
    if err != nil {
      panic(err)
    }

    eventsJson, err := json.Marshal(events)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(eventsJson)
  }

  return fn
}
