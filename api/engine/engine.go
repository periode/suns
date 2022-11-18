package engine

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"github.com/periode/suns/mailer"
)

const (
	CREATE_INTERVAL        = 30 * time.Second
	DELETE_INTERVAL        = 30 * time.Minute
	SACRIFICE_INTERVAL     = 15 * time.Minute
	EMAIL_WEEKLY_INTERVAL  = 5 * time.Second
	EMAIL_MONTHLY_INTERVAL = 20 * time.Minute
	MAP_INTERVAL           = 10 * time.Second

	CREATION_THRESHOLD  = 0.25
	ENTRYPOINT_LIFETIME = 72 * time.Hour

	MIN_ENTRYPOINTS = 10
	MAX_ENTRYPOINTS = 100

	PROMPTS_CLUSTER_UUID = "05ed6a2b-aacb-4c24-b1e1-3495821f846f"
)

type State struct {
	generation int
}

var (
	state   State
	pool    Pool
	prompts Prompts

	_, b, _, _ = runtime.Caller(0)
	Basepath   = filepath.Dir(b)
)

func StartEngine() {
	zero.Info("starting engine...")
	state = State{generation: 0}
	err := pool.Generate()
	if err != nil {
		zero.Errorf("error generating pool: %s", err.Error())
	}

	err = prompts.Populate()
	if err != nil {
		zero.Errorf("error populating prompts: %s", err.Error())
	}

	go createEntrypoints()
	go deleteEntrypoints()
	go sacrificeEntrypoints()
	go sendWeeklyEmails()
	go sendMonthlyEmails()
	go updateMap()
}

// -- createEntrypoints queries the database to know about the status of entrypoints from this generation
// -- if there are a certain amounts of entrypoints which are not open
// -- then we create new entrypoints
func createEntrypoints() {
	for {
		time.Sleep(CREATE_INTERVAL)

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
			_, err = models.AddClusterEntrypoints(pool.Pick())
			if err != nil {
				zero.Errorf("Failed to create new entrypoint: %s", err.Error())
			}

			//-- finally, regenerate the map
		}

	}
}

// -- deleteEntrypoints queries the database to know about the lifetime of entrypoints of this generation.
// -- if it is older than a given time, it deletes it.
func deleteEntrypoints() {
	for {
		time.Sleep(DELETE_INTERVAL)

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
func sacrificeEntrypoints() {
	for {
		time.Sleep(SACRIFICE_INTERVAL)
	}
}

// -- sendEmails goes through the list of users that have signed up for the emails, then it checks for the frequency of emails, checks at which stage of the emails the user is, and then sends them the subsequent email
func sendWeeklyEmails() {
	for {
		time.Sleep(EMAIL_WEEKLY_INTERVAL)

		//-- for all users, send them the prompt
		users, err := models.GetAllUsers()
		if err != nil {
			zero.Error(err.Error())
		}

		for _, user := range users {
			if user.WeeklyPromptsIndex >= len(prompts.Weekly) {
				continue
			}

			prompt, ep, err := prompts.CreateEntrypoint(user, mailer.WEEKLY)
			if err != nil {
				zero.Error(err.Error())
			}

			p := mailer.PromptPayload{
				Body:           prompt.Body,
				Name:           user.Name,
				Host:           os.Getenv("FRONTEND_HOST"),
				EntrypointUUID: ep.UUID.String(),
				EntrypointName: prompt.Name,
			}
			mailer.SendMail(user.Email, fmt.Sprintf("Weekly Rewilding Prompt #%d", user.WeeklyPromptsIndex), "rewilding_prompt", p)

			user.WeeklyPromptsIndex++
			_, err = models.UpdateUser(user.UUID, user.UUID, &user)
			if err != nil {
				zero.Error(err.Error())
			}
		}
	}
}

func sendMonthlyEmails() {
	for {
		time.Sleep(EMAIL_MONTHLY_INTERVAL)

		users, err := models.GetAllUsers()
		if err != nil {
			zero.Error(err.Error())
		}

		for _, user := range users {
			if user.MonthlyPromptsIndex >= len(prompts.Monthly) {
				continue
			}

			prompt, ep, err := prompts.CreateEntrypoint(user, mailer.MONTHLY)
			if err != nil {
				zero.Error(err.Error())
			}

			p := mailer.PromptPayload{
				Body:           prompt.Body,
				Name:           user.Name,
				Host:           os.Getenv("FRONTEND_HOST"),
				EntrypointUUID: ep.UUID.String(),
				EntrypointName: prompt.Name,
			}
			mailer.SendMail(user.Email, fmt.Sprintf("Rewilding Prompt #%d", user.MonthlyPromptsIndex), "rewilding_prompt", p)

			user.MonthlyPromptsIndex++
			_, err = models.UpdateUser(user.UUID, user.UUID, &user)
			if err != nil {
				zero.Error(err.Error())
			}
		}
	}
}

// -- updateMap queries the database for the current entrypoints, then marshals it as JSON and sends a request to the map generator to create a new background image
func updateMap() {
	for {
		time.Sleep(MAP_INTERVAL)
	}
}
