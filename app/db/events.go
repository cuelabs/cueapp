package db

import (
  "database/sql"
  "fmt"
)

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

  fmt.Println("New event created!")

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
      &e.CueID, 
      &e.EventName,
      &e.CreatedAt, 
      &e.UpdatedAt)
    
    allEvents.Data = append(allEvents.Data, e)
  }

  return nil, allEvents
}
