package db

import (
  "database/sql"
  "time"
)

var (
  DBCon *sql.DB
)

type Event struct {
  EvID int
  HostID int
  CueID int
  EventName string
  CreatedAt time.Time
  UpdatedAt time.Time
}

type Events struct {
  Data []Event
}

type EventID struct {
  ID int
}
