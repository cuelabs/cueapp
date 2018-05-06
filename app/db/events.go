package db

import (
  "database/sql"
)

func FindUsersAtEvent(db *sql.DB, id int) (error, Guests) {
  query := `
    SELECT uid, displayName, isActive FROM
      (SELECT * FROM events_users WHERE eu_evid=$1
    ) AS e
    INNER JOIN users
    ON uid=e.eu_uid
  `

  allGuests := Guests{}
  g := Guest{}

  rows, err := db.Query(query, id)
  if err != nil {
    return err, allGuests
  }

  for rows.Next() {
    rows.Scan(
      &g.UserID,
      &g.DisplayName, 
      &g.IsActive)
    
    allGuests.Data = append(allGuests.Data, g)
  }

  return nil, allGuests
}

func JoinEventCue(db *sql.DB, evcue *EventIDWithCueID) (error) {
  query := `  
    INSERT INTO events_cues (ec_evid, ec_cueid)  
    VALUES ($1, $2)`

  _, err := db.Query(
    query,
    evcue.EvID,
    evcue.CueID)

  if err != nil {
    return err
  }

  return nil
}

func CreateCue(db *sql.DB, cue *Cue) (error, int) {
  query := `  
    INSERT INTO cues (createdAt, updatedAt)  
    VALUES ($1, $2)
    RETURNING cueid`

  id := 0

  err := db.QueryRow(
    query,  
    cue.CreatedAt, 
    cue.UpdatedAt).Scan(&id)

  if err != nil {
    return err, -1
  }

  return nil, id
}

func InsertEvent(db *sql.DB, event *Event) (error, int) {
  query := `  
    INSERT INTO events (hostid, 
    eventname, createdAt, updatedAt)  
    VALUES ($1, $2, $3, $4)
    RETURNING evid`

  id := 0

  err := db.QueryRow(
    query,  
    event.HostID,
    event.EventName,
    event.CreatedAt, 
    event.UpdatedAt).Scan(&id)

  if err != nil {
    return err, -1
  }

  return nil, id
}

func FindAllEvents(db *sql.DB) (error, Events) {
  query := "SELECT * FROM events"

  allEvents := Events{}
  e := Event{}

  rows, err := db.Query(query)
  if err != nil {
    return err, allEvents
  }

  for rows.Next() {
    rows.Scan(
      &e.EvID, 
      &e.HostID, 
      &e.EventName,
      &e.CreatedAt, 
      &e.UpdatedAt)
    
    allEvents.Data = append(allEvents.Data, e)
  }

  return nil, allEvents
}

func FindOneEvent(db *sql.DB, id int) (error, Event) {
  query := "SELECT * FROM events WHERE evid=$1"

  e := Event{}

  rows, err := db.Query(query, id)
  if err != nil {
    return err, e
  }

  for rows.Next() {
    rows.Scan(
      &e.EvID, 
      &e.HostID, 
      &e.EventName,
      &e.CreatedAt, 
      &e.UpdatedAt)
  }

  return nil, e
}
