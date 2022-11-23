package mailer

import (
	"context"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/mailgun/mailgun-go/v4"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
)

const SYSTEM_DOMAIN = "mail.joiningsuns.online"
const PROMPTS_DOMAIN = "prompts.joiningsuns.online"
const SENDER = "Joining Suns <suns@mail.joiningsuns.online>"

func loadTemplate(_name string, _data interface{}) (string, error) {
	p := filepath.Join("./mailer/templates", fmt.Sprintf("%s.tmpl", _name))
	t, err := template.ParseFiles(p)

	if err != nil {
		return "", err
	}

	var body strings.Builder
	err = t.Execute(&body, _data)
	return body.String(), err
}

func SendMail(_dest string, _subject string, _template string, _data Payload) error {
	var err error
	if os.Getenv("API_MODE") == "test" {
		os.Setenv("MAILGUN_PRIVATE_API_KEY", "pubkey-9e6707d57ed1aab274ac62786539c158")
	}
	mg := mailgun.NewMailgun(SYSTEM_DOMAIN, os.Getenv("MAILGUN_PRIVATE_API_KEY"))
	mg.SetAPIBase(mailgun.APIBaseEU) //-- rgpd mon amour

	sender := SENDER
	subject := _subject
	recipient := _dest
	message := mg.NewMessage(sender, subject, "", recipient)

	err = _data.Check()
	if err != nil {
		return err
	}

	body, err := loadTemplate(_template, _data.Data())
	if err != nil {
		return err
	}
	message.SetHtml(body)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	if os.Getenv("API_MODE") != "test" && os.Getenv("CAN_SEND_MAIL") == "true" {
		_, _, err = mg.Send(ctx, message)
	} else if os.Getenv("CAN_SEND_MAIL") != "true" {
		zero.Warn("skipped sending email")
	}

	return err
}

func SendModuleProgress(dest *models.User, ep *models.Entrypoint) error {

	host := os.Getenv("FRONTEND_HOST")
	body := CompletionPayload{
		Name:           dest.Name,
		Host:           host,
		EntrypointUUID: ep.UUID.String(),
		EntrypointName: ep.Name,
	}
	SendMail(dest.Email, "Module progress", "module_progress", body)
	return nil
}
