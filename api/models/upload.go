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
	UUID      uuid.UUID      `gorm:"uniqwueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`
	Name      string         `json:"name" form:"name"`
	URL       string         `json:"url" form:"uploads_url"`
	Text      string         `json:"text" form:"text"`
	Type      string         `json:"type"`
	//-- has a user
	UserUUID string `gorm:"type:uuid;default:uuid_generate_v4()" json:"user_uuid" form:"user_uuid"`

	//-- has a module
	ModuleUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"module_uuid" form:"module_uuid"`
}
