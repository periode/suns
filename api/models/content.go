package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Content struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`

	Type  string `json:"type" yaml:"type"`
	Key   string `json:"key" yaml:"key"`
	Value string `json:"value" yaml:"value"`

	//-- belongs to a module
	ModuleUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"module_uuid" yaml:"module_uuid"`
}
