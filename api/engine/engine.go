package engine

import (
	"fmt"
	"path/filepath"
	"runtime"
	"time"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
)

const (
	CREATE_INTERVAL    = 30 * time.Second
	DELETE_INTERVAL    = 30 * time.Minute
	SACRIFICE_INTERVAL = 15 * time.Minute
	EMAIL_INTERVAL     = 10 * time.Minute
	MAP_INTERVAL       = 10 * time.Second

	CREATION_THRESHOLD  = 0.25
	ENTRYPOINT_LIFETIME = 72 * time.Hour

	MIN_ENTRYPOINTS = 10
	MAX_ENTRYPOINTS = 100
)

type State struct {
	generation int
}

var (
	state State
	pool  Pool

	_, b, _, _ = runtime.Caller(0)
	Basepath   = filepath.Dir(b)
)

func StartEngine(channel chan string) {
	zero.Info("starting engine...")

	state = State{generation: 0}
	err := pool.Generate()
	if err != nil {
		zero.Errorf("error generating pool: %s", err.Error())
	}

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

		eps, err := models.GetEntrypointsByGeneration(state.generation)
		if err != nil {
			zero.Errorf("Failed getting current generation entrypoints", err.Error())
		}

		if len(eps) > MAX_ENTRYPOINTS {
			continue
		}

		var open int = 0
		for _, ep := range eps {
			if ep.Status == models.EntrypointOpen {
				open++
			}
		}

		remaining := float32(open) / float32(len(eps))
		zero.Debug(fmt.Sprintf("Open entrypoints: %d%% (open %d, total %d)", int(remaining*100), open, len(eps)))

		if float64(remaining) < CREATION_THRESHOLD || len(eps) < MIN_ENTRYPOINTS {
			err = models.AddClusterEntrypoints(pool.Pick())
			if err != nil {
				zero.Errorf("Failed to create new entrypoint: %s", err.Error())
			}

			//-- finally, regenerate the map
		}

	}
}

// -- deleteEntrypoints queries the database to know about the lifetime of entrypoints of this generation.
// -- if it is older than a given time, it deletes it.
func deleteEntrypoints(ch chan string) {
	for {
		time.Sleep(DELETE_INTERVAL)
		ch <- "delete new entrypoints"

		eps, err := models.GetEntrypointsByGeneration(state.generation)
		if err != nil {
			zero.Errorf("Failed getting current generation entrypoints", err.Error())
		}

		for _, ep := range eps {
			if time.Since(ep.CreatedAt) > ENTRYPOINT_LIFETIME && ep.Status == models.EntrypointOpen {
				_, err = models.DeleteEntrypoint(ep.UUID)
				if err != nil {
					zero.Errorf("Failed to delete expired entrypoints", err.Error())
				}
			}
		}

		//-- finally, regenerate the map
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
