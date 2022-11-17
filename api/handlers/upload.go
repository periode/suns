package handlers

import (
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gabriel-vasile/mimetype"
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

	var ftype, fname, fpath string
	uploads := make([]models.Upload, 0)

	txt := c.FormValue("text[]")
	ftype = "text/plain"
	//-- if there is an empty string, it means we have to deal with a file
	if txt == "" {
		form, err := c.MultipartForm()
		if err != nil {
			zero.Error(err.Error())
			return c.String(http.StatusBadRequest, "Error uploading the file")
		}

		files := form.File["files[]"]
		for index, file := range files {
			fname := file.Filename
			fpath := fmt.Sprintf("%d_%s_%s_%d_%s", time.Now().Unix(), module_uuid.String()[:8], user_uuid.String()[:8], index, fname)
			target := filepath.Join(conf.UploadsDir, fpath)

			ftype, err := writeFileToDisk(file, target)
			if err != nil {
				zero.Error(err.Error())
				return c.String(http.StatusBadRequest, "Error uploading the file")
			}

			u := models.Upload{
				Name:     fname,
				URL:      fpath,
				UserUUID: user_uuid.String(),
				Text:     txt,
				Type:     ftype,
			}

			uploads = append(uploads, u)
		}
	} else {
		u := models.Upload{
			Name:     fname,
			URL:      fpath,
			UserUUID: user_uuid.String(),
			Text:     txt,
			Type:     ftype,
		}
		uploads = append(uploads, u)
	}

	zero.Debugf("adding uploads: %v \n", uploads)

	module, err := models.AddModuleUpload(module_uuid, uploads)
	if err != nil {
		zero.Warn("error getting the module")
		return c.String(http.StatusInternalServerError, "Cannot get the module")
	}

	return c.JSON(http.StatusOK, module)
}

func writeFileToDisk(file *multipart.FileHeader, target string) (string, error) {
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(target)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return "", err
	}

	// check mimetype
	bytes, err := ioutil.ReadFile(target)
	if err != nil {
		return "", err
	}
	m := mimetype.Detect(bytes)
	ftype := m.String()

	return ftype, nil
}
