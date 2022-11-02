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

const (
	EntrypointPending   string = "pending"
	EntrypointConfirmed string = "closed"
	EntrypointDeleted   string = "open"
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
	ClusterUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"cluster_uuid" yaml:"cluster_uuid"`
	Cluster     Cluster   `gorm:"foreignKey:ClusterUUID;references:UUID" json:"cluster"`

	//-- has many modules
	Modules       []Module `gorm:"foreignKey:EntrypointUUID;references:UUID" json:"modules"`
	CurrentModule int      `gorm:"default:0" json:"current_module" form:"current_module"`

	//-- has many-to-many users (0, 1 or 2)
	Users    []*User `gorm:"many2many:entrypoints_users;" json:"users"`
	MaxUsers int     `gorm:"default:1" json:"max_users"`

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
	result := db.Preload("Modules").Preload("Users").Where("uuid = ? AND status = 'listed'", uuid, user_uuid).First(&entry)
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
	result := db.Preload("Modules").Preload("Users").Where("status = 'listed'").Find(&entry)
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

func ClaimEntrypoint(entry *Entrypoint, user *User) (Entrypoint, error) {
	err := db.Model(&entry).Association("Users").Append(user)

	return *entry, err
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
