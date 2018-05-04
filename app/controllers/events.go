package controllers 

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "github.com/mattcarpowich1/cueapp/app/db"
  "fmt"
)

var (
  event db.Event
  events db.Events
  eventId db.EventIDWithCueID
  eventID db.EventId
  cue db.Cue
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

    err, eventId.EvID = db.InsertEvent(dbCon, &event)
    if err != nil {
      panic(err)
    }

    err = db.JoinEventUser(dbCon, eventId.EvID, event.HostID)
    if err != nil {
      panic(err)
    }

    cue.CreatedAt = rightNow
    cue.UpdatedAt = rightNow

    err, eventId.CueID = db.CreateCue(dbCon, &cue)
    if err != nil {
      panic(err)
    }

    err = db.JoinEventCue(dbCon, &eventId)
    if err != nil {
      panic(err)
    }

    err = db.ActivateUser(dbCon, event.HostID)
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

func ReadOneEvent (dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    err = json.NewDecoder(r.Body).Decode(&eventID)
    if err != nil {
      panic(err)
    }

    err, event = db.FindOneEvent(dbCon, eventID.ID)
    if err != nil {
      panic(err)
    }

    eventJson, err := json.Marshal(event)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(eventJson)
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

func JoinEventRequest(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r * http.Request) {
    
  }
  return fn
}
