package engine

import (
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"runtime"
	"time"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"gopkg.in/yaml.v2"
)

const (
	CREATE_INTERVAL    = 3 * time.Second
	DELETE_INTERVAL    = 10 * time.Second
	SACRIFICE_INTERVAL = 15 * time.Second
	EMAIL_INTERVAL     = 10 * time.Second
	MAP_INTERVAL       = 10 * time.Second

	CREATION_THRESHOLD = 0.25

	CLUSTER_FIRST_TIMES_UUID = "57ed6a2b-aacb-4c24-b1e1-3495821f846a"
)

type State struct {
	generation int
}

var (
	state State

	_, b, _, _ = runtime.Caller(0)
	Basepath   = filepath.Dir(b)
)

func StartEngine(channel chan string) {
	zero.Info("starting engine...")

	state = State{generation: 0}

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
		var open int = 0
		for _, ep := range eps {
			if ep.Status == models.EntrypointOpen {
				open++
			}
		}

		remaining := float32(open) / float32(len(eps))
		zero.Debug(fmt.Sprintf("Found remaining entrypoints: %f, open %d total %d", remaining, open, len(eps)))
		if float64(remaining) > CREATION_THRESHOLD {
			continue
		}

		//-- attach new entrypoints to map clusters
		//-- easiest is to read from fixtures
		bytes, err := os.ReadFile(filepath.Join(Basepath, "../models/fixtures/entrypoints", "first_times.yml"))
		if err != nil {
			zero.Errorf("Failed to read fixtures: %s", err.Error())
			continue
		}

		new := make([]models.Entrypoint, 0)
		err = yaml.Unmarshal(bytes, &new)
		if err != nil {
			zero.Errorf("Failed to marshal fixtures: %s", err.Error())
			continue
		}

		//-- randomized position could happen in models BeforeCreate
		for i, _ := range new {
			new[i].Lat = rand.Float32() * 400
			new[i].Lng = rand.Float32() * 400
			fmt.Println(new[i].Modules)
		}

		//-- todo figure out why the modules do not get appended/created, maybe appending them separately in the method below?
		err = models.AddClusterEntrypoints(CLUSTER_FIRST_TIMES_UUID, new)
		if err != nil {
			zero.Errorf("Failed to create new entrypoint: %s", err.Error())
		}
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
