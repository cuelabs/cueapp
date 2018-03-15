package main

import (
	"encoding/json"
	"github.com/cuelabs/cuerpc"
	pb "github.com/cuelabs/cuerpc"
	"github.com/cuelabs/sptfy"
	"github.com/gorilla/mux"
	"github.com/keylseyhightower/envconfig"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os"
)

type EnvVars struct {
	Version string
	Testing string
}

type Cue struct {
	CueId      gocql.UUID         `json:"cue-id"`
	EventId    gocql.UUID         `json:"event-id"`
	NowPlaying sptfy.SpotifyTrack `json:now-playing"`
}

// twirp JSON implementation handler

type cueResponse struct {
	Response *Cue `json:"response"`
	Status   int  `json:"status"`
}

type eventResponse struct {
	Response *Event `json:"response"`
	Status   int    `json:"status"`
}

type eventsResponse struct {
	Response []*Event `json:"response"`
	Status   int      `json:"status"`
}

type userResponse struct {
	Response *User `json:"response"`
	Status   int   `json:"status"`
}
