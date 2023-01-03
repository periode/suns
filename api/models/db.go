package models

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"

	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/google/uuid"
	zero "github.com/periode/suns/api/logger"
	"gopkg.in/yaml.v2"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db         *gorm.DB
	_, b, _, _ = runtime.Caller(0)
	Basepath   = filepath.Dir(b)
)

func InitDB(url string) (*gorm.DB, error) {
	var err error

	conf := &gorm.Config{}
	if os.Getenv("API_MODE") == "release" {
		conf.Logger = logger.Default.LogMode(logger.Silent)
	}

	db, err = gorm.Open(postgres.Open(url), conf)
	if err != nil {
		return db, err
	}

	result := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
	if result.Error != nil {
		return db, result.Error
	}

	// migration
	err = db.AutoMigrate(&User{}, &Cluster{}, &Entrypoint{}, &Module{}, &Token{}, &Upload{}, Task{}, Content{})
	if err != nil {
		zero.Errorf("error running migrations: %v", err)
		log.Fatal(err)
	}

	// fixtures
	if os.Getenv("RUN_FIXTURES") == "true" || os.Getenv("API_MODE") == "test" {
		err = runFixtures(true)
		if err != nil {
			zero.Errorf("error running fixtures: %v", err)
			return db, err
		}
	} else {
		zero.Debug("RUN_FIXTURES env variable not set to true, skipping fixtures...")
	}

	return db, err
}

var clusters = [7]string{"first_times", "cracks", "drought", "footprints", "symbiosis", "prompts", "welcome"}

func runFixtures(shouldTruncateTables bool) error {
	var err error

	if shouldTruncateTables {
		err := db.Exec("TRUNCATE TABLE clusters CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE entrypoints CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE users CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE uploads CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE tasks CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE contents CASCADE").Error
		if err != nil {
			return err
		}

		err = db.Exec("TRUNCATE TABLE tokens CASCADE").Error
		if err != nil {
			return err
		}
	}

	for _, c := range clusters {

		bytes, err := os.ReadFile(filepath.Join(Basepath, "./fixtures/clusters", fmt.Sprintf("%s.yml", c)))
		if err != nil {
			return err
		}

		var cluster Cluster
		err = yaml.Unmarshal(bytes, &cluster)
		if err != nil {
			return err
		}

		err = db.Create(&cluster).Error
		if err != nil {
			return err
		}
	}

	bytes, err := os.ReadFile(filepath.Join(Basepath, "fixtures", "users.yml"))
	if err != nil {
		return err
	}

	users := make([]User, 0)
	err = yaml.Unmarshal(bytes, &users)
	if err != nil {
		return err
	}

	for _, c := range users {
		err := db.Create(&c).Error
		if err != nil {
			return err
		}
	}

	token := Token{
		UUID:   uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c801"),
		UserID: uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c800"),
	}

	token_recovery := Token{
		UUID:   uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c901"),
		UserID: uuid.MustParse("e7b74bcd-c864-41ee-b5a7-d3031f76c800"),
	}

	err = db.Create(&token).Error
	if err != nil {
		return err
	}

	err = db.Create(&token_recovery).Error
	if err != nil {
		return err
	}

	return err
}
