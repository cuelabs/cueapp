package db

import (
  "database/sql"
  "fmt"
  "time"
)

var (
  DBCon *sql.DB
  t time.Time
)

type Event struct {
  EvID int
  HostID int
  CueID int
  CreatedAt time.Time
  UpdatedAt time.Time
}

type EventID struct {
  ID int
}

func InsertEvent(db *sql.DB, event *Event) (error, int) {
  query := `  
    INSERT INTO events (evid, hostid, cueid, 
    createdAt, updatedAt)  
    VALUES ($1, $2, $3, $4, $5)
    RETURNING evid`

  id := 0

  err := db.QueryRow(
    query, 
    event.EvID, 
    event.HostID,
    event.CueID,
    event.CreatedAt, 
    event.UpdatedAt).Scan(&id)

  if err != nil {
    return err, -1
  }

  fmt.Println("New event created!")

  return nil, id
}
