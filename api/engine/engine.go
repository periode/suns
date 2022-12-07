package engine

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"runtime"
	"time"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"github.com/periode/suns/mailer"
)

type State struct {
	generation    int
	sacrificeWave int
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

	Conf.DefaultConf()
	state = State{generation: 0, sacrificeWave: 0}
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

func GetWeeklyPrompt(i int) string {
	return prompts.Weekly[i].Body
}

func GetMonthlyPrompt(i int) string {
	return prompts.Monthly[i].Body
}

func GetState() map[string]int {
	var s = map[string]int{
		"generation":     state.generation,
		"sacrifice_wave": state.sacrificeWave,
	}
	return s
}

// -- createEntrypoints queries the database to know about the status of entrypoints from this generation
// -- if there are a certain amounts of entrypoints which are not open
// -- then we create new entrypoints
func createEntrypoints() {
	for {
		time.Sleep(Conf.CREATE_INTERVAL)

		eps, err := models.GetEntrypointsByGeneration(state.generation)
		if err != nil {
			zero.Errorf("Failed getting current generation entrypoints", err.Error())
		}

		if len(eps) > Conf.MAX_ENTRYPOINTS {
			continue
		}

		var open int = 0
		for _, ep := range eps {
			if ep.Status == models.EntrypointOpen {
				open++
			}
		}

		remaining := float64(open) / float64(len(eps))
		zero.Debug(fmt.Sprintf("Open entrypoints: %d%% (%d/%d)", int(remaining*100), open, len(eps)))

		if remaining < Conf.CREATION_THRESHOLD || len(eps) < Conf.MIN_ENTRYPOINTS {
			numEntrypoints := 5
			created, err := models.AddClusterEntrypoints(pool.Pick(numEntrypoints))

			for _, c := range created {
				fmt.Printf("created entrypoint %s with %d modules\n", c.Name, len(c.Modules))
			}

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
		time.Sleep(Conf.DELETE_INTERVAL)
		zero.Debug("deletting entrypoints...")

		eps, err := models.GetEntrypointsByGeneration(state.generation)
		if err != nil {
			zero.Errorf("Failed getting current generation entrypoints", err.Error())
		}

		for _, ep := range eps {
			if time.Since(ep.CreatedAt) > Conf.ENTRYPOINT_LIFETIME && ep.Status == models.EntrypointOpen {
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
		time.Sleep(Conf.SACRIFICE_INTERVAL)
		//-- this should happen in several steps
		//-- check which area is the most densely populated -> loop over entrypoints, find the ones that are the most surrounded, then pick the average mean center
		//-- select the center point and save it
		//-- sending an email to all users involved in Pending entrypoints
		//-- start a goroutine until the actual sacrifice
		//-- -- the goroutine would take care of the actual logic
		//-- -- -- delete all the entrypoints
		//-- -- -- increase the SacrificeWave
		//-- -- -- regenerate the map

		//-- inform the frontend of the remaining time before a sacrifice
	}
}

// -- sendEmails goes through the list of users that have signed up for the emails, then it checks for the frequency of emails, checks at which stage of the emails the user is, and then sends them the subsequent email
func sendWeeklyEmails() {
	for {
		time.Sleep(Conf.EMAIL_WEEKLY_INTERVAL)

		//-- for all users, send them the prompt
		users, err := models.GetAllUsers()
		if err != nil {
			zero.Error(err.Error())
		}

		for _, user := range users {
			if !user.CanReceiveWeeklyPrompts || user.WeeklyPromptsIndex >= len(prompts.Weekly) {
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
		time.Sleep(Conf.EMAIL_MONTHLY_INTERVAL)

		users, err := models.GetAllUsers()
		if err != nil {
			zero.Error(err.Error())
		}

		for _, user := range users {
			if !user.CanReceiveMonthlyPrompts || user.MonthlyPromptsIndex >= len(prompts.Monthly) {
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

// -- updateMap queries the database for the current entrypoints, then creates a POST request from it and sends a request to the map generator to create a new background image
func updateMap() {
	for {
		time.Sleep(Conf.MAP_INTERVAL)
		if os.Getenv("MAP_HOST") == "" {
			zero.Error("missing host env for map service.")
			return
		}

		body := url.Values{}
		eps, err := models.GetMapEntrypoints()
		if err != nil {
			zero.Error(err.Error())
		}

		for i, ep := range eps {
			body.Add(fmt.Sprintf("p%d", i), fmt.Sprintf("%d,%s,%s,%f,%f", ep.Generation, ep.Status, ep.Cluster.Name, ep.Lat, ep.Lng))
		}
		endpoint := fmt.Sprintf("%s/post", os.Getenv("MAP_HOST"))
		res, err := http.PostForm(endpoint, body)
		if err != nil {
			zero.Error(err.Error())
		} else {
			zero.Debugf("response from %s: %d", endpoint, res.StatusCode)
		}
	}
}
