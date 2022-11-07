package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Upload struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`
	Name      string         `json:"name" form:"name"`
	Path      string         `json:"path" form:"uploads_path"`
	Index     int            `json:"index" form:"index"` //-- the index keeps track of the position within the module

	//-- has a user
	UserUUID string `gorm:"type:uuid;default:uuid_generate_v4()" json:"user_uuid" form:"user_uuid"`

	//-- has a module
	ModuleUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"module_uuid" form:"module_uuid"`
}