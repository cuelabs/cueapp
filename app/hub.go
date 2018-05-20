// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
package main 

type message struct {
  data []byte
  event string
}

type subscription struct {
  conn *connection
  event string
}

type hub struct {
  //registered connections 
  events map[string]map[*connection]bool

  //inbound messages from connections
  broadcast chan message

  //register requests from connections
  register chan *subscription

  //unregister request from connection
  unregister chan *subscription
}

var h = hub{
  broadcast: make(chan message),
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
      connections := h.events[m.event]
      for c := range connections {
        select {
        case c.send <- m.data:
        default:
          close(c.send)
          delete(connections, c)
          if len(connections) == 0 {
            delete(h.events, m.event)
          }
        }
      }

    }
  }
}