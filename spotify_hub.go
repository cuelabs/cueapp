package main

import (
  "github.com/zmb3/spotify"
  "fmt"
)

type spotifySubscription struct {
  client *spotify.Client
  suid string
}

type spotifyHub struct {
  //connected spotify clients
  clients map[string]map[*spotify.Client]bool

  //channel for incoming clients
  register chan *spotifySubscription
}

var s = spotifyHub{
  clients: make(map[string]map[*spotify.Client]bool),
  register: make(chan *spotifySubscription),
}

func (s *spotifyHub) run() {
  for {
    select {
    case c := <- s.register:
      fmt.Println("looky here")
      fmt.Println(c.suid)
      client := s.clients[c.suid]
      if client == nil {
        client = make(map[*spotify.Client]bool)
        s.clients[c.suid] = client
      }
      client[c.client] = true
    }
  }
}