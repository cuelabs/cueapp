// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
package main 

import (
  "github.com/gorilla/websocket"
  "log"
  "net/http"
  "time"
  "strconv"
  "fmt"
)

const (
  // Time allowed to write a message to the peer.
  writeWait = 10 * time.Second

  // Time allowed to read the next pong message from the peer.
  pongWait = 60 * time.Second

  // Send pings to peer with this period. Must be less than pongWait.
  pingPeriod = (pongWait * 9) / 10

  // Maximum message size allowed from peer.
  maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
  ReadBufferSize: 1024,
  WriteBufferSize: 1024,
}

var e eventMessage

// connection is an middleman between the websocket connection and the hub.
type connection struct {
  // The websocket connection.
  ws *websocket.Conn

  // Buffered channel of outbound messages.
  send chan eventMessage

  // Event id for this connection
  evID int 
}

// readPump pumps messages from the websocket connection to the hub.
func (c *connection) readPump() {
  s := &subscription{conn: c, event: strconv.Itoa(c.evID)}
  defer func() {
    h.unregister <- s
    s.conn.ws.Close()
  }()
  s.conn.ws.SetReadLimit(maxMessageSize)
  s.conn.ws.SetReadDeadline(time.Now().Add(pongWait))
  s.conn.ws.SetPongHandler(func(string) error { 
    s.conn.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil 
  })

  for {
    err := s.conn.ws.ReadJSON(&e)
    if err != nil {
      panic(err)
    }
    fmt.Printf("Got message: %#v\n", e)
    h.broadcast <- e
  }
}

// write writes a message with the given message type and payload.
func (c *connection) write(mt int, payload []byte, e eventMessage) error {
  c.ws.SetWriteDeadline(time.Now().Add(writeWait))
  if mt == -1 {
    return c.ws.WriteJSON(e)
  }
  return c.ws.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (c *connection) writePump() {
  ticker := time.NewTicker(pingPeriod)
  defer func() {
    ticker.Stop()
    c.ws.Close()
  }()
  for {
    select {
    case message, ok := <- c.send:
      if !ok {
        c.write(websocket.CloseMessage, []byte{}, eventMessage{})
        return
      }
      if err := c.write(-1, []byte{}, message); err != nil {
        return
      }
    case <- ticker.C:
      if err := c.write(websocket.PingMessage, []byte{}, eventMessage{}); err != nil {
        return
      }
    }
  }
}

// serverWs handles websocket requests from the peer.
func serveWs(w http.ResponseWriter, r *http.Request) {
  r.Header["Origin"] = nil
  if r.Method != "GET" {
    http.Error(w, "Method not allowed", 405)
    return
  }

  log.Println("hello there")

  keys, ok := r.URL.Query()["event"]

  if !ok || len(keys) < 1 {
    log.Println("Url Param 'event' is missing")
    return
  }

  id := keys[0]

  ws, err := upgrader.Upgrade(w, r, nil)

  if err != nil {
    log.Println(err)
    return
  }

  i, err := strconv.Atoi(id)
  if err != nil {
    panic(err)
  }

  c := &connection{send: make(chan eventMessage), ws: ws, evID: i}
  s := &subscription{conn: c, event: id}
  h.register <- s
  go s.conn.writePump()
  s.conn.readPump()
}