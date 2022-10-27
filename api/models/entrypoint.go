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

type Entrypoint struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`

	Name string `gorm:"not null" json:"name" form:"name" binding:"required"`
	Slug string `gorm:"" json:"slug"`

	//-- belongs to a cluster
	//-- has-many modules

	Lat float32 `json:"lat"`
	Lng float32 `json:"lng"`
}

func (c *Entrypoint) BeforeCreate(tx *gorm.DB) (err error) {
	sp := strings.Split(slug.Make(c.Name), "-")
	i := math.Min(float64(len(sp)), 5)

	c.Slug = fmt.Sprintf("%s-%s", strings.Join(sp[:int(i)], "-"), c.UUID.String()[:8])

	return nil
}

func CreateEntrypoint(entry *Entrypoint) (Entrypoint, error) {
	result := db.Create(entry)
	return *entry, result.Error
}

func GetEntrypoint(uuid uuid.UUID, user_uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Where("uuid = ? AND (status = 'listed' OR user_uuid = ?)", uuid, user_uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	return entry, nil
}

func GetEntrypointBySlug(slug string, user_uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Where("slug = ?", slug).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	return entry, nil
}

func GetAllEntrypoints(user_uuid uuid.UUID) ([]Entrypoint, error) {
	entry := make([]Entrypoint, 0)
	result := db.Where("status = 'listed'").Find(&entry)
	return entry, result.Error
}

func UpdateEntrypoint(uuid uuid.UUID, user_uuid uuid.UUID, entry *Entrypoint) (Entrypoint, error) {
	var existing Entrypoint
	result := db.Where("uuid = ?", uuid).First(&existing)
	if result.Error != nil {
		return *entry, result.Error
	}

	result = db.Model(&existing).Where("uuid = ?", uuid).Updates(&entry)
	return existing, result.Error
}

func DeleteEntrypoint(uuid uuid.UUID, user_uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Where("uuid = ?", uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	result = db.Where("uuid = ?", uuid).Delete(&entry)
	return entry, result.Error
}
