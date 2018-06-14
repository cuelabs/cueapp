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

type SpotifyUser struct {
  SUID string
}

type Guest struct {
  UserID int
  DisplayName string
  DisplayImage string
  IsActive bool
  EventID int 
}

type Guests struct {
  Data []Guest
}

type NewUser struct {
  Username string
  CreatedAt time.Time
}

type NewSpotifyUser struct {
  SUID string
  DisplayName string
  DisplayImage string
  CreatedAt time.Time
}

type NewUserInfo struct {
  UserID int
  Username string
} 

type NewSpotifyUserID struct {
  ID int
}

type UserData struct {
  UserId int
  DisplayName string
  IsActive bool
  EventId int
  CreatedAt time.Time
  EventName string
}

type SpotifyUserData struct {
  ID int
  SUID string
  DisplayName string
  DisplayImage string
  IsActive bool
  EventId int
  CreatedAt time.Time
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
