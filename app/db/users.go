package db

import (
  "database/sql"
)

func JoinEventUser(db *sql.DB, evId int, uId int) (error) {
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

func InsertUser(db *sql.DB, user *NewUser) (error, NewUserInfo) {
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
    return err, newUser
  }

  return nil, newUser
}

func FindUser(db *sql.DB, user *User) (error, UserData) {
  u := UserData{}

  rows, err := db.Query("SELECT * FROM users WHERE uid=$1", user.Uid)
  if err != nil {
    return err, u
  }

  for rows.Next() {
    rows.Scan(
      &u.UserId, 
      &u.DisplayName, 
      &u.IsActive,
      &u.CreatedAt)
  }

  return nil, u
}

func FindCurrentUserEvent(db *sql.DB, uid int) (error, int, string) {
  var evId int
  var name string

  query := `
    SELECT eu_evid, eventname FROM events_users
    INNER JOIN events
    ON eu_uid=$1
  `

  rows, err := db.Query(query, uid)
  if err != nil {
    return err, -1, ""
  }

  for rows.Next() {
    rows.Scan(&evId, &name)
  }

  return nil, evId, name
}

func ActivateUser(db *sql.DB, userId int) error {
  _, err := db.Exec("UPDATE users SET isActive=TRUE WHERE uid=$1", userId)
  if err != nil {
    return err
  }

  return nil
}
