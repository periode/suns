package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`

	Type        string `json:"type" yaml:"type"`
	Key         string `json:"key" yaml:"key"`
	Value       string `json:"value" yaml:"value"`
	Placeholder string `json:"placeholder" yaml:"placeholder"`
	MaxLimit    int    `gorm:"default:1" json:"max_limit" yaml:"max_limit"`
	TextType    string `gorm:"default:area" json:"text_type" yaml:"text_type"`

	//-- belongs to a module
	ModuleUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"module_uuid" yaml:"module_uuid"`
}
