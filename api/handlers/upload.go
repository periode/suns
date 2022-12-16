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
	"github.com/xfrr/goffmpeg/transcoder"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"

	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
)

// -- create upload parses the form info (module_uuid, partner_index and file), adds the user_uuid from the auth session and then appends the upload to the specified module
func CreateUpload(c echo.Context) error {
	user_uuid := mustGetUser(c)
	user, err := models.GetUser(user_uuid)

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
			UserName: user.Name,
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
				UserName: user.Name,
				Text:     "",
				Type:     ftype,
			}

			uploads = append(uploads, u)
		}
	} else {
		zero.Error("unrecognized file type")
		return c.String(http.StatusBadRequest, "Error uploading the file: unknown file type")
	}

	for _, u := range uploads {
		zero.Debugf("adding upload: %s - %s", u.Type, u.Name)
	}

	module, err := models.AddModuleUpload(module_uuid, uploads)
	if err != nil {
		zero.Warn("error getting the module")
		return c.String(http.StatusInternalServerError, "Cannot get the module")
	}

	return c.JSON(http.StatusOK, module)
}

var s3Client *s3.S3

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
	s3Client = s3.New(newSession)

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
		zero.Debugf("converting image: %s", fname)
		//-- convert to webp
		m, _, err := image.Decode(src)
		if err != nil {
			return "", err
		}
		encoded, err := webp.EncodeRGBA(m, 100)
		if err != nil {
			return "", err
		}

		err = os.WriteFile(target, encoded, 0666)
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
			ACL:    aws.String("public-read"),
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
		zero.Debugf("converting video: %s", fname)

		dst, err := os.Create(target)
		if err != nil {
			return "", err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return "", err
		}

		go transcodeAndUploadVideo(uploadsDir, fname)

	} else if ftype == models.AudioType {
		zero.Debugf("converting audio: %s", fname)

		//-- upload object
		upload := s3.PutObjectInput{
			Bucket: aws.String("suns"),
			Key:    aws.String(fname),
			Body:   src,
			ACL:    aws.String("public-read"),
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

func transcodeAndUploadVideo(dir string, original string) {

	trans := new(transcoder.Transcoder)
	transcoded := fmt.Sprintf("%s_transcoded.mp4", strings.Split(original, ".")[0])
	src := filepath.Join(dir, original)
	dst := filepath.Join(dir, transcoded)

	err := trans.Initialize(src, dst) //-- overwrite video
	if err != nil {
		zero.Error(err.Error())
		return
	}

	done := trans.Run(false)
	err = <-done
	if err != nil {
		zero.Error(err.Error())
		return
	}

	body, err := os.ReadFile(dst)
	if err != nil {
		zero.Error(err.Error())
	}

	//-- upload object
	upload := s3.PutObjectInput{
		Bucket: aws.String("suns"),
		Key:    aws.String(original), //-- reuse the original fname
		Body:   bytes.NewReader(body),
		ACL:    aws.String("public-read"),
	}

	_, err = s3Client.PutObject(&upload)
	if err != nil {
		zero.Error(err.Error())
	}

	//-- cleanup after yourself
	err = os.Remove(src)
	if err != nil {
		zero.Error(err.Error())
	}

	err = os.Remove(dst)
	if err != nil {
		zero.Error(err.Error())
	}
}
