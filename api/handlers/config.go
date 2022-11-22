package handlers

import (
	"net/http"

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
	err := c.Bind(&updated)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	conf, err := engine.Conf.Set(updated)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, conf)
}
