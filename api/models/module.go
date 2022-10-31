package models

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

type Module struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`

	Name string `gorm:"not null" json:"name" form:"name" binding:"required"`
	Slug string `gorm:"" json:"slug"`

	//-- belongs to an entrypoint
	EntrypointUUID uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()" json:"entrypoint_uuid" yaml:"entrypoint_uuid"`
	Entrypoint     Entrypoint `gorm:"foreignKey:EntrypointUUID;references:UUID" json:"cluster"`
}

func (c *Module) BeforeCreate(tx *gorm.DB) (err error) {
	sp := strings.Split(slug.Make(c.Name), "-")
	i := math.Min(float64(len(sp)), 5)

	c.Slug = fmt.Sprintf("%s-%s", strings.Join(sp[:int(i)], "-"), c.UUID.String()[:8])

	return nil
}

func CreateModule(entry *Module) (Module, error) {
	result := db.Create(entry)
	return *entry, result.Error
}

func GetModule(uuid uuid.UUID, user_uuid uuid.UUID) (Module, error) {
	var entry Module
	result := db.Where("uuid = ? AND (status = 'listed' OR user_uuid = ?)", uuid, user_uuid).First(&entry)
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
	result := db.Where("status = 'listed'").Find(&entry)
	return entry, result.Error
}

func UpdateModule(uuid uuid.UUID, user_uuid uuid.UUID, entry *Module) (Module, error) {
	var existing Module
	result := db.Where("uuid = ?", uuid).First(&existing)
	if result.Error != nil {
		return *entry, result.Error
	}

	result = db.Model(&existing).Where("uuid = ?", uuid).Updates(&entry)
	return existing, result.Error
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
