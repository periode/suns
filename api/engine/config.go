package engine

import "time"

// Config holds port numbers, target directories
type Config struct {
	CREATE_INTERVAL        time.Duration
	DELETE_INTERVAL        time.Duration
	SACRIFICE_INTERVAL     time.Duration
	EMAIL_WEEKLY_INTERVAL  time.Duration
	EMAIL_MONTHLY_INTERVAL time.Duration
	MAP_INTERVAL           time.Duration

	CREATION_THRESHOLD  float64
	ENTRYPOINT_LIFETIME time.Duration

	MIN_ENTRYPOINTS int
	MAX_ENTRYPOINTS int
}

// DefaultConf is called if there is an error opening and parsing the config file
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
