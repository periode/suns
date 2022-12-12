package engine

import (
	"fmt"
	"os"

	"github.com/google/uuid"
	"github.com/mehanizm/airtable"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"github.com/periode/suns/mailer"
)

type Prompt struct {
	Body        string `json:"body"`
	Name        string `json:"name"`
	IntroType   string `json:"intro_type"`
	IntroValue  string `json:"intro_value"`
	UploadType  string `json:"upload_type"`
	UploadValue string `json:"upload_value"`
}

type Prompts struct {
	Weekly  []Prompt
	Monthly []Prompt
}

const AIRTABLE_DB_ID = "appO4245S69TqEnGW"

func (p *Prompts) Populate() error {
	if os.Getenv("AIRTABLE_API_KEY") == "" {
		return fmt.Errorf("missing Airtable API key")
	}

	client := airtable.NewClient(os.Getenv("AIRTABLE_API_KEY"))
	table := client.GetTable(AIRTABLE_DB_ID, "PromptsWeekly")
	result, err := table.GetRecords().Do()
	if err != nil {
		return err
	}

	for _, r := range result.Records {
		pr := Prompt{
			Body:        fmt.Sprintf("%v", r.Fields["Body"]),
			Name:        fmt.Sprintf("%v", r.Fields["Name"]),
			IntroType:   fmt.Sprintf("%v", r.Fields["IntroType"]),
			IntroValue:  fmt.Sprintf("%v", r.Fields["IntroValue"]),
			UploadType:  fmt.Sprintf("%v", r.Fields["UploadType"]),
			UploadValue: fmt.Sprintf("%v", r.Fields["UploadValue"]),
		}

		p.Weekly = append(p.Weekly, pr)
	}

	table = client.GetTable(AIRTABLE_DB_ID, "PromptsMonthly")
	result, err = table.GetRecords().Do()
	if err != nil {
		return err
	}

	for _, r := range result.Records {
		pr := Prompt{
			Body:        fmt.Sprintf("%v", r.Fields["Body"]),
			Name:        fmt.Sprintf("%v", r.Fields["Name"]),
			IntroType:   fmt.Sprintf("%v", r.Fields["IntroType"]),
			IntroValue:  fmt.Sprintf("%v", r.Fields["IntroValue"]),
			UploadType:  fmt.Sprintf("%v", r.Fields["UploadType"]),
			UploadValue: fmt.Sprintf("%v", r.Fields["UploadValue"]),
		}

		p.Monthly = append(p.Monthly, pr)
	}

	return nil
}

const CREATE_ENTRYPOINT = false

func (p *Prompts) CreateEntrypoint(user models.User, freq string) (Prompt, models.Entrypoint, error) {
	var ep models.Entrypoint
	var err error
	var prompt Prompt
	if freq == mailer.WEEKLY {
		prompt = prompts.Weekly[user.WeeklyPromptsIndex]
	} else if freq == mailer.MONTHLY {
		prompt = prompts.Monthly[user.MonthlyPromptsIndex]
	}

	if CREATE_ENTRYPOINT {
		mods := make([]models.Module, 0)
		mods = append(mods, models.Module{
			Name: "IntroPrompt",
			Type: "intro",
			Contents: []models.Content{
				{
					Type:  prompt.IntroType,
					Key:   "",
					Value: prompt.IntroValue,
				},
				{
					Type:  "txt",
					Key:   "",
					Value: prompt.Body,
				}},
		})
		mods = append(mods, models.Module{
			Name: "UploadPrompt",
			Type: "task",
			Tasks: []models.Task{
				{
					Type:  prompt.UploadType,
					Key:   "",
					Value: prompt.UploadValue,
				}},
		})
		mods = append(mods, models.Module{
			Name: "FinalPrompt",
			Type: "final",
		})

		ep = models.Entrypoint{
			Status:      models.EntrypointPending,
			ClusterUUID: uuid.MustParse(os.Getenv("PROMPTS_CLUSTER_UUID")),
			Name:        prompt.Name,
			Generation:  state.generation,
			MaxUsers:    1,
			Icon:        "black.svg",
			Modules:     mods,
		}

		eps, err := models.AddClusterEntrypoints([]models.Entrypoint{ep})
		if err != nil {
			return prompt, eps[0], err
		}

		ep = eps[0]

		_, err = models.ClaimEntrypoint(&ep, &user)
		if err != nil {
			return prompt, eps[0], err
		}
	} else {
		zero.Warn("skipping email entrypoint creation")
	}

	return prompt, ep, err
}
