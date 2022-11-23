package models

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

const (
	// Status of Module completion
	ModuleNone      string = "none"      // No one did this module yet
	ModulePartial   string = "partial"   // Only one person did this module
	ModuleCompleted string = "completed" // Everyone did this module
)

type Module struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:none" json:"status"`

	Name                string   `gorm:"not null" json:"name" form:"name" binding:"required"`
	Slug                string   `gorm:"" json:"slug"`
	Uploads             []Upload `gorm:"foreignKey:ModuleUUID;references:UUID" json:"uploads"`
	Type                string   `json:"type"`
	ShowPreviousUploads bool     `gorm:"default:false" json:"showPreviousUploads" yaml:"show_previous_uploads"`

	//-- belongs to an entrypoint
	EntrypointUUID uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()" json:"entrypoint_uuid" yaml:"entrypoint_uuid"`
	Entrypoint     Entrypoint `gorm:"foreignKey:EntrypointUUID;references:UUID" json:"entrypoint"`

	//-- has many content and tasks
	Tasks    []Task    `gorm:"foreignKey:ModuleUUID;references:UUID" json:"tasks"`
	Contents []Content `gorm:"foreignKey:ModuleUUID;references:UUID" json:"contents"`

	Hint string `json:"hint"`

	MaxUsers      int           `gorm:"default:1" json:"max_users" yaml:"max_users"`
	UserCompleted pq.Int32Array `gorm:"type:integer[]" json:"user_completed"` //-- 1 means user has completed the module, 0 means not yet
}

func (m *Module) BeforeCreate(tx *gorm.DB) (err error) {
	if m.UUID == uuid.Nil {
		m.UUID = uuid.New()
	}

	sp := strings.Split(slug.Make(m.Name), "-")
	i := math.Min(float64(len(sp)), 5)

	m.Slug = fmt.Sprintf("%s-%s", strings.Join(sp[:int(i)], "-"), m.UUID.String()[:8])

	if m.MaxUsers == 0 {
		m.MaxUsers = 1
	}
	for i := 0; i < m.MaxUsers; i++ {
		m.UserCompleted = append(m.UserCompleted, 0)
	}

	return nil
}

func CreateModule(entry *Module) (Module, error) {
	result := db.Create(entry)
	return *entry, result.Error
}

func GetModule(uuid uuid.UUID) (Module, error) {
	var entry Module
	result := db.Preload("Uploads").Preload("Tasks").Preload("Contents").Where("uuid = ?", uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	return entry, nil
}

func GetModuleBySlug(slug string, user_uuid uuid.UUID) (Module, error) {
	var entry Module
	result := db.Where("slug = ?", slug).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	return entry, nil
}

func GetAllModules(user_uuid uuid.UUID) ([]Module, error) {
	entry := make([]Module, 0)
	result := db.Preload("Uploads").Preload("Tasks").Preload("Contents").Find(&entry)
	return entry, result.Error
}

func UpdateModule(uuid uuid.UUID, user_uuid uuid.UUID, entry *Module) (Module, error) {
	var existing Module
	result := db.Where("uuid = ?", uuid).First(&existing)
	if result.Error != nil {
		return *entry, result.Error
	}

	result = db.Model(&existing).Updates(&entry)
	return existing, result.Error
}

func AddModuleUpload(uuid uuid.UUID, uploads []Upload) (Module, error) {
	module, err := GetModule(uuid)
	if err != nil {
		return Module{}, err
	}

	err = db.Model(&module).Association("Uploads").Append(&uploads)
	return module, err
}

func DeleteModule(uuid uuid.UUID, user_uuid uuid.UUID) (Module, error) {
	var entry Module
	result := db.Where("uuid = ?", uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	result = db.Where("uuid = ?", uuid).Delete(&entry)
	return entry, result.Error
}
