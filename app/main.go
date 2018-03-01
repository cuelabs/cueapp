package main

import (
	log "github.com/sirupsen/logrus"
)

type Config struct {
	Testing bool
	Developent bool
	Version string
}

var conf Config

func init() {

	log.Debug("processing environment variable")

}