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

func GetAllEntrypoints(c echo.Context) error {
	user_uuid := mustGetUser(c)
	clusters, err := models.GetAllEntrypoints(user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error getting the Entrypoints.")
	}

	return c.JSON(http.StatusOK, clusters)
}

func CreateEntrypoint(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	err := sanitizeEntrypoint(c)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Please check your input information.")
	}

	var cluster models.Entrypoint
	err = c.Bind(&cluster)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "There was an error parsing your input information.")
	}

	cluster, err = models.CreateEntrypoint(&cluster)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error creating the Entrypoint.")
	}

	return c.JSON(http.StatusCreated, cluster)
}

func UpdateEntrypoint(c echo.Context) error {
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

	var empty = new(models.Entrypoint)
	var input models.Entrypoint
	err = c.Bind(&input)
	if err != nil || reflect.DeepEqual(&input, empty) {
		zero.Errorf("There was an error binding the update input %v", err)
		return c.String(http.StatusBadRequest, "There was an error parsing the updated information.")
	}

	entrypoint, err := models.GetEntrypoint(uid, user_uuid)
	if err != nil {
		return c.String(http.StatusNotFound, "We couldn't find the Entrypoint to update.")
	}

	err = c.Bind(&entrypoint)
	if err != nil {
		return c.String(http.StatusBadRequest, "Error binding to the Entrypoint to update.")
	}

	updated, err := models.UpdateEntrypoint(uid, user_uuid, &entrypoint)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error updating the Entrypoint. Please try again later.")
	}

	return c.JSON(http.StatusOK, updated)
}

func ProgressEntrypoint(c echo.Context) error {
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

	var empty = new(models.Entrypoint)
	var input models.Entrypoint
	err = c.Bind(&input)
	if err != nil || reflect.DeepEqual(&input, empty) {
		zero.Errorf("There was an error binding the update input %v", err)
		return c.String(http.StatusBadRequest, "There was an error parsing the updated information.")
	}

	entrypoint, err := models.GetEntrypoint(uid, user_uuid)
	if err != nil {
		return c.String(http.StatusNotFound, "We couldn't find the Entrypoint to update.")
	}

	if entrypoint.CurrentModule == len(entrypoint.Modules)-1 {
		return c.String(http.StatusPreconditionFailed, "The entrypoint has all modules completed.")
	}

	//-- this is where we make the update logic.
	if entrypoint.MaxUsers == 1 {
		entrypoint.CurrentModule += 1
	} else if entrypoint.MaxUsers == 2 {
		//-- we update one user
		for i := 0; i < len(entrypoint.Users); i++ {
			if entrypoint.Users[i].UUID == user_uuid {
				entrypoint.UserCompleted[i] = 1
			}
		}

		//-- if both users are updated, we increase the current_module by 1
		if entrypoint.UserCompleted[0] == entrypoint.UserCompleted[1] {
			entrypoint.CurrentModule += 1
			entrypoint.UserCompleted[0] = 0
			entrypoint.UserCompleted[1] = 0
			entrypoint.StatusModule = models.EntrypointOpen
		} else { //-- if only one, we set the status as pending
			entrypoint.StatusModule = models.EntrypointPending
			zero.Warn("An entrypoint has had some progress! We should send an email")
		}
	}

	updated, err := models.UpdateEntrypoint(uid, user_uuid, &entrypoint)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error updating the Entrypoint. Please try again later.")
	}

	return c.JSON(http.StatusOK, updated)
}

func ClaimEntrypoint(c echo.Context) error {
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

	entrypoint, err := models.GetEntrypoint(uid, user_uuid)
	if err != nil {
		return c.String(http.StatusNotFound, "We couldn't find the Entrypoint to update.")
	}

	if len(entrypoint.Users) >= entrypoint.MaxUsers {
		return c.String(http.StatusPreconditionFailed, "This entrypoint has already been claimed")
	}

	user, err := models.GetUser(user_uuid, user_uuid)
	if err != nil {
		return c.String(http.StatusNotFound, "We couldn't find the User to update.")
	}

	updated, err := models.ClaimEntrypoint(&entrypoint, &user)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error updating the Entrypoint. Please try again later.")
	}

	return c.JSON(http.StatusOK, updated)
}

func GetEntrypoint(c echo.Context) error {
	user_uuid := mustGetUser(c)
	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		if len(id) < 5 || !strings.Contains(id, "-") {
			zero.Error(err.Error())
			return c.String(http.StatusBadRequest, "Not a valid ID")
		}

		coll, err := models.GetEntrypointBySlug(id, user_uuid)
		if err != nil {
			return c.String(http.StatusNotFound, "There was an error getting the requested Entrypoint.")
		}
		return c.JSON(http.StatusOK, coll)

	}

	coll, err := models.GetEntrypoint(uid, user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "We couldn't find the Entrypoint.")
	}

	return c.JSON(http.StatusOK, coll)
}

func DeleteEntrypoint(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		return c.String(http.StatusBadRequest, "Not a valid ID")
	}

	coll, err := models.DeleteEntrypoint(uid, user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "There was an error deleting the Entrypoint.")
	}

	return c.JSON(http.StatusOK, coll)
}

func sanitizeEntrypoint(c echo.Context) error {
	if len(c.FormValue("name")) < 10 || len(c.FormValue("name")) > 50 {
		zero.Errorf("the name of the Entrypoint should be between 10 and 50 characters: %d", len(c.FormValue("name")))
		return fmt.Errorf("the name of the Entrypoint should be between 10 and 50 characters: %d", len(c.FormValue("name")))
	}

	return nil
}
