package handlers

import (
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/auth"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"github.com/periode/suns/mailer"
	"golang.org/x/crypto/bcrypt"
)

func GetAllUsers(c echo.Context) error {
	users, err := models.GetAllUsers()
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, users)
}

func CreateUser(c echo.Context) error {
	err := sanitizeUserCreate(c) // Making sure adress and password are correctly formated
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, err.Error())
	}

	var user models.User
	err = c.Bind(&user) // Bind user data to user struct
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "There was an error creating your account. Please try again later.")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(c.FormValue("password")), bcrypt.DefaultCost) // Hash password
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "Error generating the hash for the password. Please try again later.")
	}
	user.Password = hashed

	user, err = models.CreateUser(&user) // Create User in database
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There already is a user with this email address. Try to login instead?")
	}

	token, err := models.CreateToken(user.UUID)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error completing your account creation. Please try again later.")
	}

	var host = os.Getenv("FRONTEND_HOST")

	payload := mailer.ConfirmationPayload{
		Name:  user.Name,
		Host:  host,
		Token: token.UUID.String(),
	}

	if os.Getenv("API_MODE") != "test" {
		err = mailer.SendMail(user.Email, "Welcome to Suns!", "account_confirmation", payload)
		if err != nil {
			zero.Warnf(err.Error())
		}
	}

	return c.JSON(http.StatusCreated, user)
}

func UpdateUser(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Not a valid ID.")
	}

	err = sanitizeUserUpdate(c)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, err.Error())
	}

	_, err = models.GetUser(uid, user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "We could not find the requested user.")
	}

	var user models.User
	err = c.Bind(&user)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "There was an error getting the update data.")
	}

	updated, err := models.UpdateUser(uid, user_uuid, &user)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error updating the user.")
	}

	return c.JSON(http.StatusOK, updated)
}

func GetUser(c echo.Context) error {
	user_uuid := mustGetUser(c)

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		if len(id) < 5 || !strings.Contains(id, "-") {
			zero.Error(err.Error())
			return c.String(http.StatusBadRequest, "Not a valid ID")
		}

		user, err := models.GetUserBySlug(id, user_uuid)
		if err != nil {
			return c.String(http.StatusNotFound, "There was an error getting the requested User.")
		}

		return c.JSON(http.StatusOK, user)
	}

	user, err := models.GetUser(uid, user_uuid)
	if err != nil {
		zero.Errorf("error getting User by UUID %v: %s", id, err)
		c.String(http.StatusNotFound, "We couldn't find the User.")
	}

	return c.JSON(http.StatusOK, user)
}

func DeleteUser(c echo.Context) error {
	user_uuid := mustGetUser(c)
	if user_uuid == uuid.Nil {
		return c.String(http.StatusUnauthorized, "unauthorized")
	}

	id := c.Param("id")
	uid, err := uuid.Parse(id)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Not a valid ID.")
	}

	user, err := models.DeleteUser(uid, user_uuid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "Error finding the user to delete.")
	}

	if os.Getenv("API_MODE") != "test" {
		data := mailer.DeletionPayload{
			Name: user.Name,
		}
		mailer.SendMail(user.Email, "Account deleted", "account_deleted", data)
	}

	return c.JSON(http.StatusOK, user)
}

func sanitizeUserCreate(c echo.Context) error {
	pw := fmt.Sprintf("%v", c.FormValue("password"))
	if len(pw) < 8 || len(pw) > 20 {
		zero.Error("the password should be between 8 and 20 characters")
		return fmt.Errorf("the password should be between 8 and 20 characters")
	}

	_, err := mail.ParseAddress(c.FormValue("email"))
	return err
}

func sanitizeUserUpdate(c echo.Context) error {
	if c.FormValue("email") != "" {
		_, err := mail.ParseAddress(c.FormValue("email"))
		if err != nil {
			zero.Error(err.Error())
			return err
		}
	}

	return nil
}

func mustGetUser(c echo.Context) uuid.UUID {
	if os.Getenv("API_MODE") == "test" {
		uuid, _ := auth.Authenticate(c)
		return uuid
	}

	if c.Get("user_uuid") == nil {
		return uuid.Nil
	}

	id := fmt.Sprintf("%s", c.Get("user_uuid"))
	uuid := uuid.MustParse(id)
	return uuid
}
