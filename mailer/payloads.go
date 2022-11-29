package mailer

import "fmt"

const (
	WEEKLY  = "weekly"
	MONTHLY = "monthly"
)

type Payload interface {
	Check() error
	Data() interface{}
}

type ConfirmationPayload struct {
	Name       string
	Host       string
	Entrypoint string
}

func (c ConfirmationPayload) Check() error {
	var err error
	if c.Name == "" || c.Host == "" || c.Entrypoint == "" {
		err = fmt.Errorf("the payload should not be empty")
	}
	return err
}

func (c ConfirmationPayload) Data() interface{} {
	return c
}

type RecoverPayload struct {
	Name  string
	Host  string
	Token string
}

func (c RecoverPayload) Check() error {
	var err error
	if c.Name == "" || c.Host == "" || c.Token == "" {
		err = fmt.Errorf("the payload should not be empty")
	}
	return err
}

func (c RecoverPayload) Data() interface{} {
	return c
}

type DeletionPayload struct {
	Name string
}

func (c DeletionPayload) Check() error {
	var err error
	if c.Name == "" {
		err = fmt.Errorf("the payload should not be empty")
	}
	return err
}

func (c DeletionPayload) Data() interface{} {
	return c
}

type CompletionPayload struct {
	Name           string
	Host           string
	EntrypointUUID string
	EntrypointName string
}

func (c CompletionPayload) Check() error {
	var err error
	if c.Name == "" || c.Host == "" || c.EntrypointUUID == "" {
		err = fmt.Errorf("the payload should not be empty")
	}
	return err
}

func (c CompletionPayload) Data() interface{} {
	return c
}

type PromptPayload struct {
	Body           string
	Name           string
	Index          int
	Host           string
	EntrypointUUID string
	EntrypointName string
}

func (w PromptPayload) Check() error {
	var err error
	if w.Index == 0 || w.Name == "" || w.Body == "" || w.Host == "" || w.EntrypointUUID == "" {
		err = fmt.Errorf("the payload should not be empty")
	}
	return err
}

func (w PromptPayload) Data() interface{} {
	return w
}
