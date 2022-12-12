package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/engine"
)

func GetState(c echo.Context) error {
	s := engine.GetState()
	return c.JSON(http.StatusOK, s)
}
