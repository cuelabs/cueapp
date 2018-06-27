package controllers

import "github.com/mattcarpowich1/cueapp/models"

var (
  // Cue controller 
  track        models.TrackWithCueID
  trackWithID  models.TrackWithID
  cid          models.CueID

  // Events controller 
  event        models.Event
  events       models.Events
  eventId      models.EventIDWithCueID
  eventID      models.EventId
  cue          models.Cue
  err          error

  // Users controller
  user         models.SpotifyUser 
  userInfo     models.NewUserInfo 
  newUser      models.NewUser 
  userData     models.SpotifyUserData
  evId         models.EventId
  guests       models.Guests
  userErr      error
)