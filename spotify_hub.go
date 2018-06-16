package main

import "github.com/zmb3/spotify"

type spotifySubscription struct {
  client *spotify.Client
  suid string
}

type SpotifyHub struct {
  // Connected spotify clients
  // clients map[string]map[*spotify.Client]bool
  clients map[string]*spotify.Client

  // Channel for incoming clients
  register chan *spotifySubscription
}

type SpotifySearch struct {
  // Spotify user ID
  SUID string

  // Search Query
  Query string
}

func (s *SpotifyHub) run() {
  for {
    select {
    case c := <- s.register:
      client := s.clients[c.suid]
      if client == nil {
        s.clients[c.suid] = c.client
      }
    }
  }
}