package handlers

import (
	"bytes"
	"fmt"
	"image"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/chai2010/webp"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"

	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
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

	var ftype, fpath string
	uploads := make([]models.Upload, 0)

	ftype = c.FormValue("type")
	if ftype == models.TextType {
		txt := c.FormValue("text[]")
		u := models.Upload{
			Name:     "",
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

			fpath, err := saveFile(file, ftype)
			if err != nil {
				zero.Error(err.Error())
				return c.String(http.StatusBadRequest, "Error uploading the file")
			}

			u := models.Upload{
				Name:     file.Filename,
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

func saveFile(file *multipart.FileHeader, ftype string) (string, error) {
	key := os.Getenv("SPACES_API_KEY")
	secret := os.Getenv("SPACES_API_SECRET")

	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(key, secret, ""),
		Endpoint:         aws.String("https://fra1.digitaloceanspaces.com/"),
		Region:           aws.String("us-east-1"),
		S3ForcePathStyle: aws.Bool(false), // Depending on your version, alternatively use o.UsePathStyle = false
	}

	newSession, err := session.NewSession(s3Config)
	if err != nil {
		return "", err
	}
	s3Client := s3.New(newSession)

	//-- generate target path
	var fext string
	switch ftype {
	case models.ImageType:
		fext = "webp"
	case models.VideoType:
		fext = "mp4"
	case models.AudioType:
		fext = "wav"
	}

	fname := fmt.Sprintf("%d_%s_%s.%s",
		time.Now().Unix(),
		uuid.New().String()[:8],
		strings.Split(file.Filename, ".")[0],
		fext,
	)

	var uploadsDir string
	if os.Getenv("UPLOADS_DIR") == "" {
		uploadsDir = "/tmp/suns/uploads"
	} else {
		uploadsDir = os.Getenv("UPLOADS_DIR")
	}

	target := filepath.Join(uploadsDir, fname)

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	if ftype == models.ImageType {

		//-- convert to webp
		var buf bytes.Buffer
		m, _, err := image.Decode(src)
		if err != nil {
			return "", err
		}
		err = webp.Encode(&buf, m, &webp.Options{Lossless: false})
		if err != nil {
			return "", err
		}

		err = os.WriteFile(target, buf.Bytes(), 0666)
		if err != nil {
			return "", err
		}

		//-- read the converted file
		body, err := os.ReadFile(target)
		if err != nil {
			return "", err
		}

		//-- upload object
		upload := s3.PutObjectInput{
			Bucket: aws.String("suns"),
			Key:    aws.String(fname),
			Body:   bytes.NewReader(body),
			ACL:    aws.String("public"),
		}

		_, err = s3Client.PutObject(&upload)
		if err != nil {
			return "", err
		}

		err = os.Remove(target)
		if err != nil {
			return "", err
		}

	} else if ftype == models.VideoType {
		// err := ffmpeg.Input(src).
		// 	Output(target, ffmpeg.KwArgs{"c:v": "libwebm"}).
		// 	ErrorToStdOut().Run()
		// if err != nil {
		// 	return "", err
		// }
		fmt.Println("converting video")

		dst, err := os.Create(target)
		if err != nil {
			return "", err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return "", err
		}
	} else if ftype == models.AudioType {
		fmt.Println("converting audio")
		//-- upload object
		upload := s3.PutObjectInput{
			Bucket: aws.String("suns"),
			Key:    aws.String(fname),
			Body:   src,
			ACL:    aws.String("public"),
		}

		_, err = s3Client.PutObject(&upload)
		if err != nil {
			return "", err
		}
	} else {
		fmt.Println("unknown upload type")
	}

	return fname, nil
}
