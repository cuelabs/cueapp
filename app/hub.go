// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
package main 

import "strconv"

type eventMessage struct {
  EventID int `json:"event_id"`
  HostID int `json:"host_id"`
  UserID int `json:"user_id"`
  DisplayName string `json:"display_name"`
  MessageType string `json:"message_type"`
}

type subscription struct {
  conn *connection
  event string
}

type hub struct {
  //registered connections 
  events map[string]map[*connection]bool

  //inbound messages from connections
  broadcast chan eventMessage

  //register requests from connections
  register chan *subscription

  //unregister request from connection
  unregister chan *subscription
}

var h = hub{
  broadcast: make(chan eventMessage),
  register: make(chan *subscription),
  unregister: make(chan *subscription),
  events: make(map[string]map[*connection]bool),
} 

func (h *hub) run() {
  for {
    select {

    case s := <- h.register:
      connections := h.events[s.event]
      if connections == nil {
        connections = make(map[*connection]bool)
        h.events[s.event] = connections
      }
      connections[s.conn] = true

    case s := <- h.unregister:
      connections := h.events[s.event]
      if connections != nil {
        if _, ok := connections[s.conn]; ok {
          delete(connections, s.conn)
          close(s.conn.send)
          if len(connections) == 0 {
            delete(h.events, s.event)
          }
        }
      }

    case m := <- h.broadcast:
      connections := h.events[strconv.Itoa(m.EventID)]
      for c := range connections {
        select {
        case c.send <- m:
        default:
          close(c.send)
          delete(connections, c)
          if len(connections) == 0 {
            delete(h.events, strconv.Itoa(m.EventID))
          }
        }
      }

    }
  }
}