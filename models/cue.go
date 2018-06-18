package models 

import (
  "database/sql"
)

func FindTrackBySURI(db *sql.DB, s string) (TrackWithID, error) {
  query := "SELECT trackid, suri FROM tracks WHERE suri=$1"
  
  t := TrackWithID{}

  rows, err := db.Query(query, s)
  if err != nil {
    return t, err
  }
  
  for rows.Next() {
    rows.Scan(&t.ID, &t.SURI)
  }

  return t, nil
}

func InsertTrack(db *sql.DB, s string) (TrackWithID, error) {
  query := `
    INSERT INTO tracks (suri) VALUES ($1) RETURNING trackid, suri
  `

  t := TrackWithID{}

  err := db.QueryRow(query, s).Scan(&t.ID, &t.SURI)
  if err != nil {
    return t, err
  }

  return t, nil
}

func UpsertTrackInCue(db *sql.DB, id int) error {
  
}