package engine

import (
	"time"

	zero "github.com/periode/suns/api/logger"
)

const (
	CREATE_INTERVAL    = 3 * time.Second
	DELETE_INTERVAL    = 10 * time.Second
	SACRIFICE_INTERVAL = 15 * time.Second
	EMAIL_INTERVAL     = 10 * time.Second
	MAP_INTERVAL       = 10 * time.Second
)

func StartEngine(channel chan string) {
	zero.Info("starting engine...")

	create_chan := make(chan string)
	delete_chan := make(chan string)
	sacrifice_chan := make(chan string)
	email_chan := make(chan string)
	map_chan := make(chan string)

	go createEntrypoints(create_chan)
	go deleteEntrypoints(delete_chan)
	go sacrificeEntrypoints(sacrifice_chan)
	go sendEmails(email_chan)
	go updateMap(map_chan)

	for {
		time.Sleep(1 * time.Second)
		select {
		case msg := <-create_chan:
			channel <- msg
		case msg := <-delete_chan:
			channel <- msg
		case msg := <-sacrifice_chan:
			channel <- msg
		case msg := <-email_chan:
			channel <- msg
		case msg := <-email_chan:
			channel <- msg
		}
	}
}

// -- createEntrypoints queries the database to know about the status of entrypoints from this generation
// -- if there are a certain amounts of entrypoints which are not open
// -- then we create new entrypoints
func createEntrypoints(ch chan string) {
	for {
		time.Sleep(CREATE_INTERVAL)
		ch <- "create new entrypoints"
	}
}

// -- deleteEntrypoints queries the database to know about the lifetime of entrypoints of this generation.
// -- if it is older than a given time, it deletes it.
func deleteEntrypoints(ch chan string) {
	for {
		time.Sleep(DELETE_INTERVAL)
		ch <- "delete new entrypoints"
	}
}

// -- sacrificeEntrypoints archives all entrypoints that are completed, deletes the other entrypoints, and regenerates the map
func sacrificeEntrypoints(ch chan string) {
	for {
		time.Sleep(SACRIFICE_INTERVAL)
		ch <- "sacrifice all entrypoints"
	}
}

// -- sendEmails goes through the list of users that have signed up for the emails, then it checks for the frequency of emails, checks at which stage of the emails the user is, and then sends them the subsequent email
func sendEmails(ch chan string) {
	for {
		time.Sleep(EMAIL_INTERVAL)
		ch <- "send emails"
	}
}

// -- updateMap queries the database for the current entrypoints, then marshals it as JSON and sends a request to the map generator to create a new background image
func updateMap(ch chan string) {
	for {
		time.Sleep(MAP_INTERVAL)
		ch <- "update the map"
	}
}
