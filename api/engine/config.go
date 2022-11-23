package engine

import (
	"fmt"
	"os"
	"reflect"
	"strconv"
	"time"
)

// Config holds engine variables
type Config struct {
	CREATE_INTERVAL        time.Duration `form:"CREATE_INTERVAL"`
	DELETE_INTERVAL        time.Duration `form:"DELETE_INTERVAL"`
	SACRIFICE_INTERVAL     time.Duration `form:"SACRIFICE_INTERVAL"`
	EMAIL_WEEKLY_INTERVAL  time.Duration `form:"EMAIL_WEEKLY_INTERVAL"`
	EMAIL_MONTHLY_INTERVAL time.Duration `form:"EMAIL_MONTHLY_INTERVAL"`
	MAP_INTERVAL           time.Duration `form:"MAP_INTERVAL" type:"time"`

	CREATION_THRESHOLD  float64       `form:"CREATION_THRESHOLD"`
	ENTRYPOINT_LIFETIME time.Duration `form:"ENTRYPOINT_LIFETIME"`

	MIN_ENTRYPOINTS int `form:"MIN_ENTRYPOINTS"`
	MAX_ENTRYPOINTS int `form:"MAX_ENTRYPOINTS"`
}

var Conf Config

// DefaultConf sets reasonable defaults or reads from env variables
func (c *Config) DefaultConf() {
	d, err := time.ParseDuration(os.Getenv("CREATE_INTERVAL"))
	if err != nil {
		c.CREATE_INTERVAL = 30 * time.Second
	} else {
		c.CREATE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("DELETE_INTERVAL"))
	if err != nil {
		c.DELETE_INTERVAL = 30 * time.Minute
	} else {
		c.DELETE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("SACRIFICE_INTERVAL"))
	if err != nil {
		c.SACRIFICE_INTERVAL = 15 * time.Minute
	} else {
		c.SACRIFICE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("EMAIL_WEEKLY_INTERVAL"))
	if err != nil {
		c.EMAIL_WEEKLY_INTERVAL = 5 * time.Minute
	} else {
		c.EMAIL_WEEKLY_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("EMAIL_MONTHLY_INTERVAL"))

	if err != nil {
		c.EMAIL_MONTHLY_INTERVAL = 20 * time.Minute
	} else {
		c.EMAIL_MONTHLY_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("MAP_INTERVAL"))
	if err != nil {
		c.MAP_INTERVAL = 10 * time.Second
	} else {
		c.MAP_INTERVAL = d
	}

	f, err := strconv.ParseFloat(os.Getenv("CREATION_THRESHOLD"), 64)
	if err != nil {
		c.CREATION_THRESHOLD = 0.25
	} else {
		c.CREATION_THRESHOLD = f
	}

	d, err = time.ParseDuration(os.Getenv("ENTRYPOINT_LIFETIME"))
	if err != nil {
		c.ENTRYPOINT_LIFETIME = 72 * time.Hour
	} else {
		c.ENTRYPOINT_LIFETIME = d
	}

	i, err := strconv.Atoi(os.Getenv("MIN_ENTRYPOINTS"))
	if err != nil {
		c.MIN_ENTRYPOINTS = 10
	} else {
		c.MIN_ENTRYPOINTS = i
	}

	i, err = strconv.Atoi(os.Getenv("MAX_ENTRYPOINTS"))
	if err != nil {
		c.MAX_ENTRYPOINTS = 100
	} else {
		c.MAX_ENTRYPOINTS = i
	}

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
