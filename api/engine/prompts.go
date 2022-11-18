package engine

import (
	"fmt"
	"os"

	"github.com/mehanizm/airtable"
)

type Prompt struct {
	Body       string `json:"body"`
	Name       string `json:"name"`
	IntroType  string `json:"intro_type"`
	IntroValue string `json:"intro_value"`
	UploadType string `json:"upload_type"`
}

type Prompts struct {
	Weekly  []Prompt
	Monthly []Prompt
}

const DB_ID = "appO4245S69TqEnGW"

func (p *Prompts) Populate() error {
	if os.Getenv("AIRTABLE_API_KEY") == "" {
		return fmt.Errorf("missing Airtable API key")
	}

	client := airtable.NewClient(os.Getenv("AIRTABLE_API_KEY"))
	table := client.GetTable(DB_ID, "PromptsWeekly")
	result, err := table.GetRecords().Do()
	if err != nil {
		//-- load dummy prompts
		pr := Prompt{
			Body:       "This is the Body",
			Name:       "This is the Name",
			IntroType:  "This is the IntroType",
			IntroValue: "This is the IntroValue",
			UploadType: "This is the UploadType",
		}

		p.Weekly = append(p.Weekly, pr)
		return err
	}

	for _, r := range result.Records {
		pr := Prompt{
			Body:       fmt.Sprintf("%v", r.Fields["Body"]),
			Name:       fmt.Sprintf("%v", r.Fields["Name"]),
			IntroType:  fmt.Sprintf("%v", r.Fields["IntroType"]),
			IntroValue: fmt.Sprintf("%v", r.Fields["IntroValue"]),
			UploadType: fmt.Sprintf("%v", r.Fields["UploadType"]),
		}

		p.Weekly = append(p.Weekly, pr)
	}

	return nil
}
