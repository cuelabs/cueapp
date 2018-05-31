package models

import (
  "database/sql"
  "fmt"
)

func JoinEventUser(db *sql.DB, evId int, uId int) error {
  query := `  
    INSERT INTO events_users (eu_evid, eu_uid)  
    VALUES ($1, $2)`

  _, err := db.Query(
    query,
    evId,
    uId)

  if err != nil {
    return err
  }

  return nil
}

func DeleteEventUser(db *sql.DB, evId int, uId int) error {
  query := `  
    DELETE FROM events_users
    WHERE eu_evid=$1 AND eu_uid=$2
  `

  _, err := db.Query(
    query,
    evId,
    uId)

  if err != nil {
    return err
  }

  return nil
}

func InsertUser(db *sql.DB, user *NewUser) (NewUserInfo, error) {
  query := `  
    INSERT INTO users (displayName, createdAt)  
    VALUES ($1, $2)
    RETURNING uid, displayName`

  newUser := NewUserInfo{}

  err := db.QueryRow(
    query,  
    user.Username, 
    user.CreatedAt).Scan(&newUser.UserID, &newUser.Username)

  if err != nil {
    return newUser, err
  }

  return newUser, nil
}

func InsertSpotifyUser(db *sql.DB, user *NewSpotifyUser) (NewSpotifyUserID, error) {
  query := `  
    INSERT INTO users (suid, displayName, displayImage, createdAt)  
    VALUES ($1, $2, $3, $4)
    RETURNING uid`

  newUser := NewSpotifyUserID{}

  err := db.QueryRow(
    query,  
    user.SUID,
    user.DisplayName,
    user.DisplayImage, 
    user.CreatedAt).Scan(&newUser.ID)

  if err != nil {
    return newUser, err
  }

  return newUser, nil
}

func FindUser(db *sql.DB, user *User) (UserData, error) {
  u := UserData{}

  rows, err := db.Query("SELECT * FROM users WHERE uid=$1", user.Uid)
  if err != nil {
    return u, err
  }

  for rows.Next() {
    rows.Scan(
      &u.UserId, 
      &u.DisplayName, 
      &u.IsActive,
      &u.EventId,
      &u.CreatedAt)
  }

  return u, nil
}

func FindUserBySUID(db *sql.DB, id string) (SpotifyUserData, error) {
  u := SpotifyUserData{}
  fmt.Println("id in function " + id)

  rows, err := db.Query("SELECT * FROM users WHERE suid=$1", id)
  if err != nil {
    return u, err
  }

  for rows.Next() {
    rows.Scan(
      &u.ID,
      &u.SUID, 
      &u.DisplayName, 
      &u.IsActive,
      &u.EventId,
      &u.CreatedAt,
      &u.DisplayName)
  }

  return u, nil
}

func FindCurrentUserEvent(db *sql.DB, uid int) (int, string, error) {
  var evId int
  var name string

  query := `
    SELECT eu_evid, eventname FROM (
      SELECT eu_evid FROM events_users WHERE eu_uid=$1 
      ) as e
    INNER JOIN events
    ON e.eu_evid=events.evid
  `

  rows, err := db.Query(query, uid)
  if err != nil {
    return -1, "", err
  }

  for rows.Next() {
    rows.Scan(&evId, &name)
  }

  return evId, name, nil
}

func UpdateUserEvent(db *sql.DB, eventId int, userId int) error {
  _, err := db.Exec("UPDATE users SET u_evid=$1 WHERE uid=$2", eventId, userId)
  if err != nil {
    return err
  }

  return nil
}

func ActivateUser(db *sql.DB, userId int) error {
  _, err := db.Exec("UPDATE users SET isActive=TRUE WHERE uid=$1", userId)
  if err != nil {
    return err
  }

  return nil
}

func DeactivateUser(db *sql.DB, userId int) error {
  _, err := db.Exec("UPDATE users SET isActive=FALSE WHERE uid=$1", userId)
  if err != nil {
    return err
  }

  return nil
}
