package engine

import (
	"fmt"
	"os"
	"reflect"
	"strconv"
	"time"

	zero "github.com/periode/suns/api/logger"
)

// Config holds engine variables
type Config struct {
	CREATE_INTERVAL time.Duration `form:"CREATE_INTERVAL"`
	DELETE_INTERVAL time.Duration `form:"DELETE_INTERVAL"`

	EMAIL_WEEKLY_INTERVAL  time.Duration `form:"EMAIL_WEEKLY_INTERVAL"`
	EMAIL_MONTHLY_INTERVAL time.Duration `form:"EMAIL_MONTHLY_INTERVAL"`

	SACRIFICE_INTERVAL    time.Duration `form:"SACRIFICE_INTERVAL"`
	SACRIFICE_ZONE_RADIUS float64       `form:"SACRIFICE_ZONE_RADIUS"`
	SACRIFICE_DELAY       time.Duration `form:"SACRIFICE_DELAY"`
	SACRIFICE_THRESHOLD   int           `form:"SACRIFICE_THRESHOLD"`

	CREATION_THRESHOLD    float64       `form:"CREATION_THRESHOLD"`
	ENTRYPOINT_LIFETIME   time.Duration `form:"ENTRYPOINT_LIFETIME"`
	NEW_ENTRYPOINT_AMOUNT int           `form:"NEW_ENTRYPOINT_AMOUNT"`

	MIN_ENTRYPOINTS int `form:"MIN_ENTRYPOINTS"`
	MAX_ENTRYPOINTS int `form:"MAX_ENTRYPOINTS"`
}

var Conf Config

// DefaultConf sets reasonable defaults or reads from env variables
func (c *Config) DefaultConf() {
	d, err := time.ParseDuration(os.Getenv("CREATE_INTERVAL"))
	if err != nil {
		c.CREATE_INTERVAL = 1 * time.Hour
	} else {
		c.CREATE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("DELETE_INTERVAL"))
	if err != nil {
		c.DELETE_INTERVAL = 45 * time.Minute
	} else {
		c.DELETE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("SACRIFICE_INTERVAL"))
	if err != nil {
		c.SACRIFICE_INTERVAL = 144 * time.Hour
	} else {
		c.SACRIFICE_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("EMAIL_WEEKLY_INTERVAL"))
	if err != nil {
		c.EMAIL_WEEKLY_INTERVAL = 7 * 24 * time.Hour
	} else {
		c.EMAIL_WEEKLY_INTERVAL = d
	}

	d, err = time.ParseDuration(os.Getenv("EMAIL_MONTHLY_INTERVAL"))

	if err != nil {
		c.EMAIL_MONTHLY_INTERVAL = 30 * 7 * 24 * time.Hour
	} else {
		c.EMAIL_MONTHLY_INTERVAL = d
	}

	f, err := strconv.ParseFloat(os.Getenv("SACRIFICE_ZONE_RADIUS"), 64)
	if err != nil {
		c.SACRIFICE_ZONE_RADIUS = 600
	} else {
		c.SACRIFICE_ZONE_RADIUS = f
	}

	d, err = time.ParseDuration(os.Getenv("SACRIFICE_DELAY"))
	if err != nil {
		c.SACRIFICE_DELAY = 36 * time.Hour
	} else {
		c.SACRIFICE_DELAY = d
	}

	i, err := strconv.Atoi(os.Getenv("SACRIFICE_THRESHOLD"))
	if err != nil {
		c.SACRIFICE_THRESHOLD = 70
	} else {
		c.SACRIFICE_THRESHOLD = i
	}

	f, err = strconv.ParseFloat(os.Getenv("CREATION_THRESHOLD"), 64)
	if err != nil {
		c.CREATION_THRESHOLD = 0.25
	} else {
		c.CREATION_THRESHOLD = f
	}

	d, err = time.ParseDuration(os.Getenv("ENTRYPOINT_LIFETIME"))
	if err != nil {
		c.ENTRYPOINT_LIFETIME = 48 * time.Hour
	} else {
		c.ENTRYPOINT_LIFETIME = d
	}

	i, err = strconv.Atoi(os.Getenv("MIN_ENTRYPOINTS"))
	if err != nil {
		c.MIN_ENTRYPOINTS = 70
	} else {
		c.MIN_ENTRYPOINTS = i
	}

	i, err = strconv.Atoi(os.Getenv("NEW_ENTRYPOINT_AMOUNT"))
	if err != nil {
		c.NEW_ENTRYPOINT_AMOUNT = 5
	} else {
		c.NEW_ENTRYPOINT_AMOUNT = i
	}

	i, err = strconv.Atoi(os.Getenv("MAX_ENTRYPOINTS"))
	if err != nil {
		c.MAX_ENTRYPOINTS = 200
	} else {
		c.MAX_ENTRYPOINTS = i
	}
}

func (c *Config) Print() {
	zero.Log.Info().
		Dur("CREATE_INTERVAL", c.CREATE_INTERVAL).
		Dur("DELETE_INTERVAL", c.DELETE_INTERVAL).
		Dur("SACRIFICE_INTERVAL", c.SACRIFICE_INTERVAL).
		Dur("EMAIL_WEEKLY_INTERVAL", c.EMAIL_WEEKLY_INTERVAL).
		Dur("EMAIL_MONTHLY_INTERVAL", c.EMAIL_MONTHLY_INTERVAL).
		Float64("SACRIFICE_ZONE_RADIUS", c.SACRIFICE_ZONE_RADIUS).
		Dur("SACRIFICE_DELAY", c.SACRIFICE_DELAY).
		Int("SACRIFICE_THRESHOLD", c.SACRIFICE_THRESHOLD).
		Float64("CREATION_THRESHOLD", c.CREATION_THRESHOLD).
		Dur("ENTRYPOINT_LIFETIME", c.ENTRYPOINT_LIFETIME).
		Int("MIN_ENTRYPOINTS", c.MIN_ENTRYPOINTS).
		Int("MAX_ENTRYPOINTS", c.MAX_ENTRYPOINTS).
		Msg("engine started with configuration")
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
