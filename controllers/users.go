package controllers

import (
  "net/http"
  "encoding/json"
  "time"
  "github.com/mattcarpowich1/cueapp/models"
)

func ReadAllUsersEvent(w http.ResponseWriter, r *http.Request) {
  dbCon := models.DBCon
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

// controller for temp login
func CreateUser(w http.ResponseWriter, r *http.Request) {
  dbCon := models.DBCon
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

// controller for fetching necessary userdata on site load
func LoadUser(w http.ResponseWriter, r *http.Request) {
  dbCon := models.DBCon
  userErr = json.NewDecoder(r.Body).Decode(&user)
  if userErr != nil {
    panic(userErr)
  }

  userData, userErr = models.FindUserBySUID(dbCon, user.SUID)
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
