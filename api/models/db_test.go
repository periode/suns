package models_test

import (
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/periode/suns/api/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var (
	databaseTestURL    string = "postgres://postgres:postgres@localhost:5432/suns-test"
	syllabusID         uuid.UUID
	syllabusUnlistedID uuid.UUID
	syllabusSlug       string
	syllabusTitle      string
	syllabusUserName   string
	syllabusDeleteID   uuid.UUID
	syllabusUnknownID  uuid.UUID

	clusterID        uuid.UUID
	clusterSlug      string
	clusterName      string
	clusterDeleteID  uuid.UUID
	clusterUnknownID uuid.UUID

	attachmentID        uuid.UUID
	attachmentSlug      string
	attachmentName      string
	attachmentURL       string
	attachmentDeleteID  uuid.UUID
	attachmentUnknownID uuid.UUID

	moduleID        uuid.UUID
	moduleSlug      string
	moduleName      string
	moduleDeleteID  uuid.UUID
	moduleUnknownID uuid.UUID

	userID         uuid.UUID
	userSlug       string
	userDeleteID   uuid.UUID
	userUnknownID  uuid.UUID
	userEmail      string
	userName       string
	userDeleteName string

	instID uuid.UUID
)

func TestInitDB(t *testing.T) {
	time.Sleep(1 * time.Second)
	databaseTestURL = os.Getenv("DATABASE_TEST_URL")
	if databaseTestURL == "" {
		databaseTestURL = "postgres://postgres:postgres@localhost:5432/suns-test"
	}
	_, err := models.InitDB(databaseTestURL)
	assert.Nil(t, err)
}

func setup(t *testing.T) func(t *testing.T) {
	syllabusID = uuid.MustParse("46de6a2b-aacb-4c24-b1e1-3495821f846a")
	syllabusUnlistedID = uuid.MustParse("46de6a2b-aacb-4c24-b1e1-3495821f8469")
	syllabusSlug = "ungewohnt-46de6a2b"
	syllabusTitle = "Ungewohnt"
	syllabusUserName = "Justyna Poplawska"
	syllabusDeleteID = uuid.MustParse("46de6a2b-aacb-4c24-b1e1-3495821f8469")
	syllabusUnknownID = uuid.New()

	clusterID = uuid.MustParse("b9e4c3ed-ac4f-4e44-bb43-5123b7b6d7a9")
	clusterSlug = "good-public-stuff-b9e4c3ed"
	clusterName = "Good public stuff"
	clusterDeleteID = uuid.MustParse("b9e4c3ed-ac4f-4e44-bb43-5123b7b6d7a7")
	clusterUnknownID = uuid.New()

	moduleID = uuid.MustParse("2a73291d-559f-47c1-b24d-92a3606deb50")
	moduleSlug = "module-b-2a73291d"
	moduleName = "Module B"
	moduleDeleteID = uuid.MustParse("2a73291d-559f-47c1-b24d-92a3606deb49")
	moduleUnknownID = uuid.New()

	attachmentID = uuid.MustParse("c55f0baf-12b8-4bdb-b5e6-2280bff8ab21")
	attachmentSlug = "chair-website-c55f0baf"
	attachmentName = "Chair website"
	attachmentURL = "https://fg.vanr.tu-berlin.de/ungewohnt/"
	attachmentDeleteID = uuid.MustParse("c55f0baf-12b8-4bdb-b5e6-2280bff8ab30")
	attachmentUnknownID = uuid.New()

	userID = uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c8a8")
	userSlug = "justyna-poplawska-e7b74bcd"
	userDeleteID = uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c8a9")
	userUnknownID = uuid.New()
	userEmail = "jus@pop.com"
	userName = "Justyna Poplawska"
	userDeleteName = "Pierre Depaz"

	instID = uuid.MustParse("c0e4c3ed-ac4f-4e44-bb43-5123b7b6d7a0")

	mustSeedDB(t)
	return func(t *testing.T) {

	}
}

// -- todo here we should check whether the db is already initialized or not
func mustSeedDB(t *testing.T) {
	os.Setenv("API_MODE", "test")
	databaseTestURL = os.Getenv("DATABASE_TEST_URL")
	if databaseTestURL == "" {
		databaseTestURL = "postgres://postgres:postgres@localhost:5432/suns-test"
	}
	_, err := models.InitDB(databaseTestURL)
	require.Nil(t, err)
}
