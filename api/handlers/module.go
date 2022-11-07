package handlers

import (
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
)

func GetAllModules(c echo.Context) error {
	user_uuid := mustGetUser(c)
	clusters, err := models.GetAllModules(user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error getting the Modules.")
	}

	return c.JSON(http.StatusOK, clusters)
}

func CreateModule(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	err := sanitizeModule(c)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Please check your input information.")
	}

	var cluster models.Module
	err = c.Bind(&cluster)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "There was an error parsing your input information.")
	}

	cluster, err = models.CreateModule(&cluster)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error creating the Module.")
	}

	return c.JSON(http.StatusCreated, cluster)
}

func UpdateModule(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Not a valid ID")
	}

	var empty = new(models.Module)
	var input models.Module
	err = c.Bind(&input)
	if err != nil || reflect.DeepEqual(&input, empty) {
		zero.Errorf("There was an error binding the update input %v", err)
		return c.String(http.StatusBadRequest, "There was an error parsing the updated information.")
	}

	coll, err := models.GetModule(uid)
	if err != nil {
		return c.String(http.StatusNotFound, "We couldn't find the Module to update.")
	}

	err = c.Bind(&coll)
	if err != nil {
		return c.String(http.StatusBadRequest, "Error binding to the Module to update.")
	}

	updated, err := models.UpdateModule(uid, user_uuid, &coll)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error updating the Module. Please try again later.")
	}

	return c.JSON(http.StatusOK, updated)
}

func GetModule(c echo.Context) error {
	user_uuid := mustGetUser(c)
	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		if len(id) < 5 || !strings.Contains(id, "-") {
			zero.Error(err.Error())
			return c.String(http.StatusBadRequest, "Not a valid ID")
		}

		coll, err := models.GetModuleBySlug(id, user_uuid)
		if err != nil {
			return c.String(http.StatusNotFound, "There was an error getting the requested Module.")
		}
		return c.JSON(http.StatusOK, coll)

	}

	coll, err := models.GetModule(uid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "We couldn't find the Module.")
	}

	return c.JSON(http.StatusOK, coll)
}

func DeleteModule(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "Not a valid ID")
	}

	coll, err := models.DeleteModule(uid, user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "There was an error deleting the Module.")
	}

	return c.JSON(http.StatusOK, coll)
}

func sanitizeModule(c echo.Context) error {
	if len(c.FormValue("name")) < 10 || len(c.FormValue("name")) > 50 {
		zero.Errorf("the name of the Module should be between 10 and 50 characters: %d", len(c.FormValue("name")))
		return fmt.Errorf("the name of the Module should be between 10 and 50 characters: %d", len(c.FormValue("name")))
	}

	return nil
}
