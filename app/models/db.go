package models

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
  EventName string
  IsActive bool
  CreatedAt time.Time
  UpdatedAt time.Time
}

type User struct {
  Uid int
}

type Guest struct {
  UserID int
  DisplayName string
  IsActive bool 
}

type Guests struct {
  Data []Guest
}

type NewUser struct {
  Username string
  CreatedAt time.Time
}

type NewUserInfo struct {
  UserID int
  Username string
}

type UserData struct {
  UserId int
  DisplayName string
  IsActive bool
  CreatedAt time.Time
  EventId int
  EventName string
}

type Cue struct {
  CueID int
  CreatedAt time.Time
  UpdatedAt time.Time
}

type Events struct {
  Data []Event
}

type EventId struct {
  ID int 
}

type EventIDWithCueID struct {
  EvID int
  CueID int
}
