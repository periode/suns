package handlers

import (
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/auth"
	"github.com/periode/suns/api/engine"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"github.com/periode/suns/mailer"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/yaml.v2"
)

var (
	_, b, _, _ = runtime.Caller(0)
	Basepath   = filepath.Dir(b)
)

const BOT_USER_ID = "e8b74bcd-c864-41ee-b5a7-d3031f76c8a8"

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
		println("here")
		return c.String(http.StatusBadRequest, err.Error())
	}

	var user models.User
	err = c.Bind(&user) // Bind user data to user struct
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "There was an error creating your account. Please try again later.")
	}

	//-- save the mark
	form, err := c.MultipartForm()
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusBadRequest, "Error getting the mark from the form")
	}

	mark := form.File["mark"][0]
	fname := fmt.Sprintf("marks/%d_%s_%s.%s",
		time.Now().Unix(),
		uuid.New().String()[:8],
		strings.Split(mark.Filename, ".")[0],
		"webp",
	)
	go saveFile(mark, models.ImageType, fname)
	user.MarkURL = fname

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

	bytes, err := os.ReadFile(filepath.Join(Basepath, "../models/fixtures/clusters/welcome.yml"))
	if err != nil {
		return err
	}

	var welcome models.Cluster
	err = yaml.Unmarshal(bytes, &welcome)
	if err != nil {
		return err
	}

	eps, err := models.AddClusterEntrypoints(welcome.Entrypoints)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error creating your entrypoint.")
	}

	//-- claim entrypoint by the bot
	bot, err := models.GetUser(uuid.MustParse(BOT_USER_ID))
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error claiming your entrypoint.")
	}

	_, err = models.ClaimEntrypoint(&eps[0], &bot)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error claiming your entrypoint.")
	}

	//-- manually create the bot uploads
	for _, mod := range eps[0].Modules {
		if len(mod.Uploads) > 0 {
			_, err := models.AddModuleUpload(mod.UUID, mod.Uploads)
			if err != nil {
				zero.Warn("error getting the module")
				return c.String(http.StatusInternalServerError, "Cannot get the module")
			}
		}
	}

	//-- claim entrypoint by the new user
	ep, err := models.ClaimEntrypoint(&eps[0], &user)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusInternalServerError, "There was an error claiming your entrypoint.")
	}

	var host = os.Getenv("FRONTEND_HOST")
	payload := mailer.ConfirmationPayload{
		Name:       user.Name,
		Host:       host,
		Entrypoint: ep.UUID.String(),
	}

	if os.Getenv("API_MODE") != "test" {
		err = mailer.SendMail(user.Email, "Welcome to Suns!", "account_creation", payload)
		if err != nil {
			zero.Warnf(err.Error())
		}
	}

	return c.String(http.StatusCreated, ep.UUID.String())
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

	_, err = models.GetUser(uid)
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

func UpdateUserPrompts(c echo.Context) error {
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

	user, err := models.GetUser(uid)
	if err != nil {
		zero.Error(err.Error())
		return c.String(http.StatusNotFound, "We could not find the requested user.")
	}

	if c.FormValue("weekly") == "on" {
		user.CanReceiveWeeklyPrompts = true
		p := mailer.PromptPayload{
			Body: engine.GetWeeklyPrompt(0),
			Name: user.Name,
		}

		err = mailer.SendMail(user.Email, "SIMPLE Rewilding Prompt #1", "weekly_intro", p)
		if err != nil {
			zero.Error(err.Error())
			return c.String(http.StatusInternalServerError, "We could not send the weekly intro email.")
		}
	}

	if c.FormValue("monthly") == "on" {
		user.CanReceiveMonthlyPrompts = true
		p := mailer.PromptPayload{
			Body: engine.GetMonthlyPrompt(0),
			Name: user.Name,
		}

		err = mailer.SendMail(user.Email, "COMPLEX Rewilding Prompt #1", "monthly_intro", p)
		if err != nil {
			zero.Error(err.Error())
			return c.String(http.StatusInternalServerError, "We could not send the monthly intro email.")
		}
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

	user, err := models.GetUser(uid)
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
