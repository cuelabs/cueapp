package controllers

import (
  "net/http"
  "encoding/json"
  "database/sql"
  "time"
  "github.com/mattcarpowich1/cueapp/app/models"
)

var (
  user models.User 
  userInfo models.NewUserInfo
  newUser models.NewUser 
  userData models.UserData
  evId models.EventId
  guests models.Guests
  userErr error
)

func ReadAllUsersEvent(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    userErr = json.NewDecoder(r.Body).Decode(&evId)
    if userErr != nil {
      panic(userErr)
    }

    guests, userErr = models.FindUsersAtEvent(dbCon, evId.ID)
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
    userInfo, userErr = models.InsertUser(dbCon, &newUser)
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

    userData, userErr = models.FindUser(dbCon, &user)
    if userErr != nil {
      panic(userErr)
    }

    userData.EventId, userData.EventName, userErr = models.FindCurrentUserEvent(dbCon, userData.UserId)
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