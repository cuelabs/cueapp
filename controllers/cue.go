package controllers

import (
  "net/http"
  "github.com/mattcarpowich1/cueapp/models"
  "encoding/json"
  "fmt"
)

// currently this selects the oldest track in the cue, 
// but will eventually integrate the Cue Selection Algorithm
func ReadNextTrackFromCue(w http.ResponseWriter, r *http.Request) {
  dbCon := models.DBCon
  err = json.NewDecoder(r.Body).Decode(&cid)
  if err != nil {
    panic(err)
  }

  trackWithID, err = models.SelectOldestTrackInCue(dbCon, cid.ID)
  if err != nil {
    panic(err)
    return
  }

  fmt.Println("cue id")
  fmt.Println(cid.ID)
  fmt.Println("track id")
  fmt.Println(trackWithID.ID)

  err = models.UpdateSelectedTrack(dbCon, trackWithID.ID, cid.ID)
  if err != nil {
    panic(err)
    return
  }

  trackJson, err2 := json.Marshal(trackWithID)
  if err2 != nil {
    panic(err2)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  w.Write(trackJson)
}

func AddTrackToCue(w http.ResponseWriter, r *http.Request) {
  dbCon := models.DBCon
  err = json.NewDecoder(r.Body).Decode(&track)
  if err != nil {
    panic(err)
  }

  // Debuggin' (TrackWithCueID)
  fmt.Println("track.SURI")
  fmt.Println(track.SURI)
  fmt.Println("track.CueID")
  fmt.Println(track.CueID)

  // Find track if it's already there (t is TrackWithID)
  t, err2 := models.FindTrackBySURI(dbCon, track.SURI)
  if err2 != nil {
    panic(err2)
    return
  }

  // More Debuggin' (TrackWithID)
  fmt.Println("t.ID")
  fmt.Println(t.ID)
  fmt.Println("t.SURI")
  fmt.Println(t.SURI)

  // If track not in DB, insert new row (t is TrackWithID)
  if t.ID <= 0 {
    t, err2 = models.InsertTrack(dbCon, track.SURI)
    if err2 != nil {
      panic(err2)
      return
    } 
  }

  // Add track to cues_tracks or increase number of votes
  // for that particular track in the cue if it's already
  // in the cue
  err = models.UpsertTrackInCue(dbCon, track.CueID, t.ID)
  if err != nil {
    panic(err)
    return
  }

  // Send TrackWithID JSON back to client (ID probably isn't necessary)
  trackJson, err3 := json.Marshal(t)
  if err3 != nil {
    panic(err3)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  w.Write(trackJson)
}