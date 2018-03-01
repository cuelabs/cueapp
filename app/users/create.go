package users

import (
  "net/http"
	"github.com/gocql/gocql"
	log "github.com/sirupsen/logrus"
)

// Client side
func Create(w http.ResponseWriter, r *http.Request) {
	var errs []string

	user, errs := FormToUser(r)

	log.Debug("creating a new user")

	if len(errs) == 0 {
		// CreateUser client call with user info # protobuf
	}

	var created bool = false

}