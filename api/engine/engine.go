package engine

import (
	"fmt"
	"math"
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
	sacrificeTime time.Time
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
	Conf.Print()

	state = State{generation: 0, sacrificeWave: 0, sacrificeTime: time.Time{}}
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

	updateMap()
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
		"sacrifice_time": int(state.sacrificeTime.Unix()),
	}
	return s
}

// -- createEntrypoints queries the database to know about the status of entrypoints from this generation
// -- if there are a certain amounts of entrypoints which are not open
// -- then we create new entrypoints
func createEntrypoints() {
	for {
		time.Sleep(Conf.CREATE_INTERVAL)

		eps, err := models.GetMapEntrypoints()
		if err != nil {
			zero.Errorf("Failed getting current map entrypoints", err.Error())
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
		zero.Debug(fmt.Sprintf("open entrypoints: %d%% (%d/%d)", int(remaining*100), open, len(eps)))

		if remaining < Conf.CREATION_THRESHOLD || len(eps) < Conf.MIN_ENTRYPOINTS {
			state.generation++
			newEps, err := pool.Pick(Conf.NEW_ENTRYPOINT_AMOUNT)
			if err != nil {
				zero.Errorf("Failed to generate new entrypoint: %s", err.Error())
			}

			_, err = models.AddClusterEntrypoints(newEps)
			if err != nil {
				zero.Errorf("Failed to create new entrypoint: %s", err.Error())
			}

			updateMap()
		}

	}
}

// -- deleteEntrypoints queries the database to know about the lifetime of entrypoints of this generation.
// -- if it is older than a given time, it deletes it.
func deleteEntrypoints() {
	for {
		time.Sleep(Conf.DELETE_INTERVAL)
		zero.Debug("deleting entrypoints...")

		eps, err := models.GetEntrypointsByGeneration(state.generation)
		if err != nil {
			zero.Errorf("Failed getting current generation entrypoints", err.Error())
		}

		for _, ep := range eps {
			if (time.Since(ep.CreatedAt) > Conf.ENTRYPOINT_LIFETIME && ep.Status == models.EntrypointOpen) || len(ep.Modules) == 0 {
				zero.Debugf("deleting: %s", ep.Name)
				_, err = models.DeleteEntrypoint(ep.UUID)
				if err != nil {
					zero.Errorf("Failed to delete expired entrypoints", err.Error())
				}
			}
		}

		updateMap()
	}
}

// -- sacrificeEntrypoints archives all entrypoints that are completed, deletes the other entrypoints, and regenerates the map
func sacrificeEntrypoints() {
	for {
		time.Sleep(Conf.SACRIFICE_INTERVAL)

		//-- check which area is the most densely populated
		eps, err := models.GetMapEntrypoints()
		if err != nil {
			zero.Error(err.Error())
			continue
		}

		fmt.Println("sacrifice checking with entrypoints length:", len(eps))

		var epicentre models.Entrypoint
		var neighbors = make([]models.Entrypoint, 0)
		for _, center := range eps {
			numberOfNeighbors := 0
			n := make([]models.Entrypoint, 0)

			for _, periph := range eps {
				dist := distance(center, periph)
				if dist < Conf.SACRIFICE_ZONE_RADIUS {
					numberOfNeighbors++
					n = append(n, periph)
					if numberOfNeighbors > len(neighbors) {
						epicentre = center
						neighbors = n
					}
				}
			}
		}

		offerings := append(neighbors, epicentre)

		//-- select the center point and save it
		fmt.Printf("epicenter of sacrifice is %s (%s), with %d neighbors\n", epicentre.Name, epicentre.UUID.String(), len(neighbors))

		if len(offerings) < Conf.SACRIFICE_THRESHOLD {
			zero.Debug("not enough points to sacrifice, continuing...")
			continue
		}

		//-- sending an email to all users involved in Pending entrypoints
		err = mailer.SendSacrificeEmail(offerings)
		if err != nil {
			zero.Error(err.Error())
			continue
		}

		//-- inform the frontend of the remaining time before a sacrifice
		state.sacrificeTime = time.Now().Add(Conf.SACRIFICE_DELAY)
		go commitSacrifice(offerings)
	}
}

// -- -- -- delete all the entrypoints
// -- -- -- increase the SacrificeWave
// -- -- -- regenerate the map
func commitSacrifice(offerings []models.Entrypoint) {
	zero.Debugf("Commiting sacrifice in %v", Conf.SACRIFICE_DELAY.String())
	time.Sleep(Conf.SACRIFICE_DELAY)

	zero.Debugf("Commiting sacrifice NOW")
	for _, o := range offerings {
		models.DeleteEntrypoint(o.UUID)
	}

	state.sacrificeWave++
	state.sacrificeTime = time.Time{}

	updateMap()
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
	if os.Getenv("MAP_HOST") == "" {
		zero.Error("missing host env for map service.")
		return
	}

	body := url.Values{}
	eps, err := models.GetMapEntrypoints()
	if err != nil {
		zero.Error(err.Error())
	}

	zero.Debugf("map updating with entrypoints: %d", len(eps))

	for i, ep := range eps {
		body.Add(fmt.Sprintf("p%d", i), fmt.Sprintf("%d,%s,%s,%f,%f", ep.Generation, ep.Status, ep.Cluster.Name, ep.Lat, ep.Lng))
	}
	endpoint := os.Getenv("MAP_HOST")
	res, err := http.PostForm(endpoint, body)
	if err != nil {
		zero.Error(err.Error())
	} else {
		zero.Debugf("response from %s: %d", endpoint, res.StatusCode)
	}
}

func distance(a models.Entrypoint, b models.Entrypoint) float64 {
	y1 := float64(a.Lat)
	x1 := float64(a.Lng)

	y2 := float64(b.Lat)
	x2 := float64(b.Lng)

	dist := math.Sqrt(math.Pow(x1-x2, 2) + math.Pow(y1-y2, 2))

	return dist
}
