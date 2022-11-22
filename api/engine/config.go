package engine

import (
	"fmt"
	"reflect"
	"time"
)

// Config holds engine variables
type Config struct {
	CREATE_INTERVAL        time.Duration `form:"CREATE_INTERVAL"`
	DELETE_INTERVAL        time.Duration `form:"DELETE_INTERVAL"`
	SACRIFICE_INTERVAL     time.Duration `form:"SACRIFICE_INTERVAL"`
	EMAIL_WEEKLY_INTERVAL  time.Duration `form:"EMAIL_WEEKLY_INTERVAL"`
	EMAIL_MONTHLY_INTERVAL time.Duration `form:"EMAIL_MONTHLY_INTERVAL"`
	MAP_INTERVAL           time.Duration `form:"MAP_INTERVAL"`

	CREATION_THRESHOLD  float64       `form:"CREATION_THRESHOLD"`
	ENTRYPOINT_LIFETIME time.Duration `form:"ENTRYPOINT_LIFETIME"`

	MIN_ENTRYPOINTS int `form:"MIN_ENTRYPOINTS"`
	MAX_ENTRYPOINTS int `form:"MAX_ENTRYPOINTS"`
}

var Conf Config

// DefaultConf sets reasonable defaults
func (c *Config) DefaultConf() {
	c.CREATE_INTERVAL = 30 * time.Second
	c.DELETE_INTERVAL = 30 * time.Minute
	c.SACRIFICE_INTERVAL = 15 * time.Minute
	c.EMAIL_WEEKLY_INTERVAL = 5 * time.Minute
	c.EMAIL_MONTHLY_INTERVAL = 20 * time.Minute
	c.MAP_INTERVAL = 10 * time.Second

	c.CREATION_THRESHOLD = 0.25
	c.ENTRYPOINT_LIFETIME = 72 * time.Hour

	c.MIN_ENTRYPOINTS = 10
	c.MAX_ENTRYPOINTS = 100
}

func (c *Config) Set(updated Config) (Config, error) {
	confVal := reflect.ValueOf(&Conf).Elem()
	updatedVal := reflect.ValueOf(&updated).Elem()

	for i := 0; i < confVal.NumField(); i++ {
		field := confVal.Field(i)
		val := updatedVal.Field(i)

		if val.IsZero() {
			continue
		}

		field.Set(val)
	}
	return Conf, nil
}

func (c *Config) Get() (Config, error) {
	var empty Config
	if Conf == empty {
		Conf.DefaultConf()
	}
	fmt.Printf("getting %v\n", c)
	return Conf, nil
}
