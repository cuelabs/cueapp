package controllers

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/models"
  "encoding/json"
)

var (
  track models.TrackWithCueID
  suri models.Track
  cid models.CueID
)

// currently this selects the oldest track in the cue, 
// but will eventually integrate the Cue Selection Algorithm
func ReadNextTrackFromCue(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    err = json.NewDecoder(r.Body).Decode(&cid)
    if err != nil {
      panic(err)
    }

    suri, err = models.SelectOldestTrackInCue(dbCon, cid.ID)
    if err != nil {
      panic(err)
      return
    }

    suriJson, err2 := json.Marshal(suri)
    if err2 != nil {
      panic(err2)
      return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(suriJson)
  }
  return fn
}

func AddTrackToCue(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    err = json.NewDecoder(r.Body).Decode(&track)
    if err != nil {
      panic(err)
    }

    // Find track if it's already there (t is TrackWithID)
    t, err2 := models.FindTrackBySURI(dbCon, track.SURI)
    if err2 != nil {
      panic(err2)
      return
    }

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


    trackJson, err3 := json.Marshal(t)
    if err3 != nil {
      panic(err3)
      return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(trackJson)
  }
  return fn
}