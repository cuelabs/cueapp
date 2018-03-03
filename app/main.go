package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
	"net/http"
	"time"
	//"github.com/gocql/gocql"
)

//type Config struct {
//	Testing    bool
//	Developent bool
//	Version    string
//}

//var conf Config

func main() {

	log.Debug("processing environment variables")

	log.Debug("Creating a router")
	r := mux.NewRouter().StrictSlash(true)
	log.Debug("adding handlers")

	//staticFileDirectory := http.Dir("assets/")
	//staticFileHandler := http.StripPrefix("/", http.FileServer(staticFileDirectory))

	//r.PathPrefix("/").Handler(staticFileHandler).Methods("GET")

	r.HandleFunc("/events", events)
	log.Debug("added dev events handler")

	log.Debugf("ready to serve at %s", time.Now().UTC().Format(time.RFC3339))
	http.ListenAndServe(":6000", r)
}

// The basic lifecycle unit of the app.
type Event struct {
	Host        string    `json:"host"`
	Cue         string    `json:"cue,omitempty"`
	Name        string    `json:"name"`
	StartedAt   time.Time `json:"startedt_at"`
	Evid        string    `json:"evid"`
	EndedAt     time.Time `json:"ended_at,omitempty"`
	LastUpdated time.Time `json:"last_updated,omitempty"`
}

type EventResponse struct {
	EventId *Event
	Code    int `json:"code"`
}

type EventResponses []EventResponse

// A JSON reply to ensure that the API is up
func events(w http.ResponseWriter, r *http.Request) {
	ev0 := &Event{
		"dev-uid-leland",
		"dev-cid-0",
		"Another weekend",
		time.Now(),
		"dev-evid-0",
		time.Now(),
		time.Now(),
	}
	ev1 := &Event{
		"dev-uid-shadow-leland",
		"dev-cid-1",
		"Deep thinking",
		time.Now(),
		"dev-evid-1",
		time.Now(),
		time.Now(),
	}
	ev2 := &Event{
		"dev-uid-josh",
		"dev-cid-2",
		"Another weekend ii",
		time.Now(),
		"dev-evid-2",
		time.Now(),
		time.Now(),
	}
	json.NewEncoder(w).Encode(&EventResponse{ev0, 200})
	json.NewEncoder(w).Encode(&EventResponse{ev1, 200})
	json.NewEncoder(w).Encode(&EventResponse{ev2, 200})
}
