package main

import "github.com/zmb3/spotify"

type spotifyHub struct {
  //connected spotify clients
  clients map[string]map[*spotify.Client]bool
}