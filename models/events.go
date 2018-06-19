package models

import (
  "database/sql"
  "fmt"
)

func FindUsersAtEvent(db *sql.DB, id int) (Guests, error) {
  query := `
    SELECT uid, displayName, displayImage, isActive, u_evid FROM
      (SELECT * FROM events_users WHERE eu_evid=$1
    ) AS e
    INNER JOIN users
    ON uid=e.eu_uid
  `

  allGuests := Guests{}
  g := Guest{}

  rows, err := db.Query(query, id)
  if err != nil {
    return allGuests, err
  }

  for rows.Next() {
    rows.Scan(
      &g.UserID,
      &g.DisplayName,
      &g.DisplayImage, 
      &g.IsActive,
      &g.EventID)
    
    allGuests.Data = append(allGuests.Data, g)
  }

  return allGuests, nil
}

func JoinEventCue(db *sql.DB, evcue *EventIDWithCueID) error {
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

func CreateCue(db *sql.DB, cue *Cue) (int, error) {
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
    return -1, err
  }

  return id, nil
}

func InsertEvent(db *sql.DB, event *Event) (int, error) {
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
    return -1, err
  }

  return id, nil
}

func FindAllEvents(db *sql.DB) (Events, error) {
  query := "SELECT * FROM events WHERE isactive=TRUE"

  allEvents := Events{}
  e := Event{}

  rows, err := db.Query(query)
  if err != nil {
    return allEvents, err
  }

  for rows.Next() {
    rows.Scan(
      &e.EvID, 
      &e.HostID, 
      &e.EventName,
      &e.IsActive,
      &e.CreatedAt, 
      &e.UpdatedAt)
    
    allEvents.Data = append(allEvents.Data, e)
  }

  return allEvents, nil
}

func FindOneEvent(db *sql.DB, id int) (Event, error) {
  // query := "SELECT * FROM events WHERE evid=$1"
  query := `
    SELECT * FROM (
      SELECT * FROM events WHERE evid=$1
    ) as e
    INNER JOIN events_cues
    ON e.evid=ec_evid
  `

  e := Event{}

  rows, err := db.Query(query, id)
  if err != nil {
    fmt.Println("is it here")
    return e, err
  }

  fmt.Println("or here")

  for rows.Next() {
    rows.Scan(
      &e.EvID, 
      &e.HostID, 
      &e.EventName,
      &e.IsActive,
      &e.CreatedAt, 
      &e.UpdatedAt,
      &e.CueID)
  }

  return e, nil
}

// func FindCueIDByEventID(db *sql.DB, id int) (int, error) {
//   query := `
//     SELECT ec_cueid FROM events_cues WHERE ec_evid=$1
//   `
//   c := 0

//   err := db.QueryRow(
//       query,   
//       id).Scan(&c)
//   if err != nil {
//     return c, err
//   }

//   return c, nil
// }

func FindEventNameById(db *sql.DB, id int) (string, error) {
  query := "SELECT eventname FROM events WHERE evid=$1"
  var s string
  rows, err := db.Query(query, id)
  if err != nil {
    return s, err
  }

  for rows.Next() {
    rows.Scan(&s)
  }

  return s, nil
}

func DeactivateAllUsersAtEvent(db *sql.DB, id int) error {
  query := `
  UPDATE users as u
  SET isActive=FALSE,
    u_evid=-1
  FROM (
    SELECT * FROM users 
      INNER JOIN (
        SELECT * FROM events_users
          INNER JOIN (
            SELECT evid FROM events WHERE evid=$1
            ) as ev
          ON ev.evid=eu_evid
        ) as evusers
      ON evusers.eu_uid=uid
  ) as u2
  WHERE u2.uid=u.uid;`

  _, err := db.Exec(query, id)

  if err != nil {
    return err
  }

  return nil
}

func DeactivateEvent(db *sql.DB, id int) error {
  query := "UPDATE events SET isActive=FALSE WHERE evid=$1"

  _, err := db.Exec(query, id)
  
  if err != nil {
    return err
  }

  return nil
}
