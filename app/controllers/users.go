package controllers

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "github.com/mattcarpowich1/cueapp/app/db"
  // "fmt"
)

var (
  user db.User 
  newUser db.NewUser 
  userData db.UserData
  userErr error
)

// controller for temp login
func CreateUser(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    userErr = json.NewDecoder(r.Body).Decode(&newUser)
    if userErr != nil {
      panic(userErr)
    }

    newUser.CreatedAt = time.Now()
    userErr, user.UserId = db.InsertUser(dbCon, &newUser)
    if userErr != nil {
      panic(userErr)
    }

    userIdJson, err := json.Marshal(user)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
    w.Write(userIdJson)
  }
  return fn
}

// controller for fetching necessary userdata on site load
func LoadUser(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    userErr = json.NewDecoder(r.Body).Decode(&user)
    if userErr != nil {
      panic(userErr)
    }

    userErr, userData = db.FindUser(dbCon, &user)
    if userErr != nil {
      panic(userErr)
    }

    if userData.IsActive {
      userErr, userData.EventId, userData.EventName = db.FindCurrentUserEvent(dbCon, userData.UserId)
    }

    userDataJson, err := json.Marshal(userData)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
    w.Write(userDataJson)
  }
  return fn
}