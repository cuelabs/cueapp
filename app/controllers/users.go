package controllers

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "github.com/mattcarpowich1/cueapp/app/db"
)

var (
  user db.User 
  userInfo db.NewUserInfo
  newUser db.NewUser 
  userData db.UserData
  evId db.EventId
  guests db.Guests
  userErr error
)

func ReadAllUsersEvent(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    userErr = json.NewDecoder(r.Body).Decode(&evId)
    if userErr != nil {
      panic(userErr)
    }

    userErr, guests = db.FindUsersAtEvent(dbCon, evId.ID)
    if userErr != nil {
      panic(userErr)
    }

    guestsJson, err := json.Marshal(guests)
    if err != nil {
      panic(err)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(guestsJson)
  }
  return fn
}

// controller for temp login
func CreateUser(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    userErr = json.NewDecoder(r.Body).Decode(&newUser)
    if userErr != nil {
      panic(userErr)
    }

    newUser.CreatedAt = time.Now()
    userErr, userInfo = db.InsertUser(dbCon, &newUser)
    if userErr != nil {
      panic(userErr)
    }

    userIdJson, err := json.Marshal(userInfo)
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

    // fmt.Println(user.Uid)

    userErr, userData = db.FindUser(dbCon, &user)
    if userErr != nil {
      panic(userErr)
    }

    userErr, userData.EventId, userData.EventName = db.FindCurrentUserEvent(dbCon, userData.UserId)
    if userErr != nil {
      panic(userErr)
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