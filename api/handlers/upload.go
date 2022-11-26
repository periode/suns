package handlers

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
)

// -- create upload parses the form info (module_uuid, partner_index and file), adds the user_uuid from the auth session and then appends the upload to the specified module
func CreateUpload(c echo.Context) error {
	user_uuid := mustGetUser(c)

	// Read form fields - module uuid is to know to which module to attach it to, and partner index is whether this is upload by partner 0 or 1
	module_uuid, err := uuid.Parse(c.FormValue("module_uuid"))
	if err != nil {
		zero.Warn("error getting the module UUID")
		return c.String(http.StatusBadRequest, "Cannot parse the module UUID")
	}

	var ftype, fname, fpath string
	uploads := make([]models.Upload, 0)

	ftype = c.FormValue("type")
	if ftype == models.TextType {
		txt := c.FormValue("text[]")
		u := models.Upload{
			Name:     fname,
			URL:      fpath,
			UserUUID: user_uuid.String(),
			Text:     txt,
			Type:     ftype,
		}
		uploads = append(uploads, u)
	} else if ftype == models.VideoType || ftype == models.ImageType || ftype == models.AudioType {
		form, err := c.MultipartForm()
		if err != nil {
			zero.Error(err.Error())
			return c.String(http.StatusBadRequest, "Error uploading the file")
		}

		files := form.File["files[]"]
		for _, file := range files {

			fpath, err := writeFileToDisk(file, ftype)
			if err != nil {
				zero.Error(err.Error())
				return c.String(http.StatusBadRequest, "Error uploading the file")
			}

			u := models.Upload{
				Name:     fname,
				URL:      fpath,
				UserUUID: user_uuid.String(),
				Text:     "",
				Type:     ftype,
			}

			uploads = append(uploads, u)
		}
	} else {
		zero.Error("unrecognized file type")
		return c.String(http.StatusBadRequest, "Error uploading the file: unknown file type")
	}

	// based on that uploaded file, we can convert it to a known file extension
	// it should be done with ffmpeg, but that's going to depend on available libraries to be installed locally and with docker
	// the writeToDisk function should be changed to return the path of the written file, rather than its type (known before hand)

	zero.Debugf("adding uploads: %v \n", uploads)

	module, err := models.AddModuleUpload(module_uuid, uploads)
	if err != nil {
		zero.Warn("error getting the module")
		return c.String(http.StatusInternalServerError, "Cannot get the module")
	}

	return c.JSON(http.StatusOK, module)
}

func writeFileToDisk(file *multipart.FileHeader, ftype string) (string, error) {
	var uploadsDir string
	if os.Getenv("UPLOADS_DIR") == "" {
		uploadsDir = "/tmp/suns/uploads"
	} else {
		uploadsDir = os.Getenv("UPLOADS_DIR")
	}

	//-- generate target path
	var fext string
	switch ftype {
	case models.ImageType:
		fext = "webp"
	case models.VideoType:
		fext = "webm"
	case models.AudioType:
		fext = "wav"
	}

	fname := fmt.Sprintf("%d_%s_%s.%s",
		time.Now().Unix(),
		uuid.New().String()[:8],
		strings.Split(file.Filename, ".")[0],
		fext,
	)
	target := filepath.Join(uploadsDir, fname)

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	//-- this is where the conversion should be happening. it would be ideal if ffmpeg can just do it with an in-memory file as input
	if ftype == models.ImageType {
		// err := ffmpeg.Input(src).
		// 	Output(target, ffmpeg.KwArgs{"c:v": "libwebp"}).
		// 	ErrorToStdOut().Run()
		// if err != nil {
		// 	return "", err
		// }
		fmt.Println("converting image")
	} else if ftype == models.VideoType {
		// err := ffmpeg.Input(src).
		// 	Output(target, ffmpeg.KwArgs{"c:v": "libwebm"}).
		// 	ErrorToStdOut().Run()
		// if err != nil {
		// 	return "", err
		// }
		fmt.Println("converting video")
	}

	dst, err := os.Create(target)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return "", err
	}

	return fname, nil
}
