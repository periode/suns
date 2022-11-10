package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/config"
	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
)

// -- create upload parses the form info (module_uuid, partner_index and file), adds the user_uuid from the auth session and then appends the upload to the specified module
func CreateUpload(c echo.Context) error {
	user_uuid := mustGetUser(c)
	conf := c.Get("config").(config.Config)

	// Read form fields - module uuid is to know to which module to attach it to, and partner index is whether this is upload by partner 0 or 1
	module_uuid, err := uuid.Parse(c.FormValue("module_uuid"))
	if err != nil {
		zero.Warn("error getting the module UUID")
		return c.String(http.StatusBadRequest, "Cannot parse the module UUID")
	}

	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	var fname = fmt.Sprintf("%s_%s_%s", module_uuid.String()[:13], user_uuid.String()[5:], file.Filename)
	target := filepath.Join(conf.UploadsDir, fname)
	dst, err := os.Create(target)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	upload := models.Upload{
		Name:     file.Filename,
		URL:      fname,
		UserUUID: user_uuid.String(),
	}

	//-- then get the module, append the upload, and update it
	module, err := models.AddModuleUpload(module_uuid, upload)
	if err != nil {
		zero.Warn("error getting the module")
		return c.String(http.StatusInternalServerError, "Cannot get the module")
	}

	return c.JSON(http.StatusOK, module)
}
