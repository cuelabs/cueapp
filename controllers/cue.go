package controllers

import (
  "net/http"
  "database/sql"
  "github.com/mattcarpowich1/cueapp/models"
  "encoding/json"
)

var (
  track models.TrackWithCueID
)

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