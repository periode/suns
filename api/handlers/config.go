package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/engine"
)

func GetConfig(c echo.Context) error {
	conf, err := engine.Conf.Get()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, conf)
}

func SetConfig(c echo.Context) error {
	// user := mustGetUser(c)
	// if user == uuid.Nil {
	// 	return c.String(http.StatusUnauthorized, "unauthorized")
	// }

	var updated engine.Config
	d, err := time.ParseDuration(c.FormValue("CREATE_INTERVAL"))
	if err == nil {
		updated.CREATE_INTERVAL = d
	}

	d, err = time.ParseDuration(c.FormValue("DELETE_INTERVAL"))
	if err == nil {
		updated.DELETE_INTERVAL = d
	}

	d, err = time.ParseDuration(c.FormValue("SACRIFICE_INTERVAL"))
	if err == nil {
		updated.SACRIFICE_INTERVAL = d
	}

	d, err = time.ParseDuration(c.FormValue("EMAIL_WEEKLY_INTERVAL"))
	if err == nil {
		updated.EMAIL_WEEKLY_INTERVAL = d
	}

	d, err = time.ParseDuration(c.FormValue("EMAIL_MONTHLY_INTERVAL"))
	if err == nil {
		updated.EMAIL_MONTHLY_INTERVAL = d
	}

	d, err = time.ParseDuration(c.FormValue("ENTRYPOINT_LIFETIME"))
	if err == nil {
		updated.ENTRYPOINT_LIFETIME = d
	}

	d, err = time.ParseDuration(c.FormValue("ENTRYPOINT_LIFETIME"))
	if err == nil {
		updated.ENTRYPOINT_LIFETIME = d
	}

	f, err := strconv.ParseFloat(c.FormValue("CREATION_THRESHOLD"), 64)
	if err == nil {
		updated.CREATION_THRESHOLD = f
	}

	i, err := strconv.Atoi(c.FormValue("MIN_ENTRYPOINTS"))
	if err == nil {
		updated.MIN_ENTRYPOINTS = i
	}

	i, err = strconv.Atoi(c.FormValue("MAX_ENTRYPOINTS"))
	if err == nil {
		updated.MAX_ENTRYPOINTS = i
	}

	conf, err := engine.Conf.Set(updated)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, conf)
}
