package models

import (
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

const (
	// Status of Entrypoint with regards to completion
	EntrypointUnlisted  string = "unlisted"  // Entrypoint exists but is not displayed yet
	EntrypointOpen      string = "open"      // Entrypoint is ready to be claimed
	EntrypointPending   string = "pending"   // Entrypoint is claimed and someone is working on it
	EntrypointCompleted string = "completed" // Entrypoint has been completed
)

const (
	// Status of Partners of the Entrypoint
	PartnerNone    string = "none"
	PartnerPartial string = "partial"
	PartnerFull    string = "full"
)

const (
	// Type of Final module for layour
	FinalModuleTangled         string = "Tangled"
	FinalModuleTangledInverted string = "Tangled Inverted"
	FinalModuleSeperate        string = "Seperate"
)

type Entrypoint struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`

	Name       string `gorm:"not null" json:"name" form:"name" binding:"required"`
	Slug       string `gorm:"" json:"slug"`
	Icon       string `json:"icon" yaml:"icon"`
	Generation int    `gorm:"default:0" json:"generation"`

	//-- belongs to a cluster
	ClusterUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"cluster_uuid" yaml:"cluster_uuid"`
	Cluster     Cluster   `gorm:"foreignKey:ClusterUUID;references:UUID" json:"cluster"`

	//-- has many modules
	Modules         []Module `gorm:"foreignKey:EntrypointUUID;references:UUID" json:"modules"`
	CurrentModule   int      `gorm:"default:0" json:"current_module" form:"current_module"`
	FinalModuleType string   `gorm:"default:Seperate" json:"final_module_type"`

	//-- has many-to-many users (0, 1 or 2)
	Users         []*User       `gorm:"many2many:entrypoints_users;" json:"users"`
	MaxUsers      int           `gorm:"default:1" json:"max_users" yaml:"max_users"`
	UserCompleted pq.Int32Array `gorm:"type:integer[]" json:"user_completed"` //-- 1 means user has completed the module, 0 means not yet
	PartnerStatus string        `gorm:"default:none" json:"partner_status"`

	Lat float32 `json:"lat"`
	Lng float32 `json:"lng"`
}

func (e *Entrypoint) BeforeCreate(tx *gorm.DB) (err error) {
	sp := strings.Split(slug.Make(e.Name), "-")
	i := math.Min(float64(len(sp)), 5)

	e.Slug = fmt.Sprintf("%s-%s", strings.Join(sp[:int(i)], "-"), e.UUID.String()[:8])

	if e.MaxUsers == 0 {
		e.MaxUsers = 1
	}
	for i := 0; i < e.MaxUsers; i++ {
		e.UserCompleted = append(e.UserCompleted, 0)
	}

	e.Lat = rand.Float32()*900 + 50
	e.Lng = rand.Float32()*900 + 50

	return nil
}

func CreateEntrypoint(entry *Entrypoint) (Entrypoint, error) {
	result := db.Create(entry)
	return *entry, result.Error
}

func GetEntrypoint(uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Preload("Modules").Preload("Users").Where("uuid = ?", uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	for i, m := range entry.Modules {
		mod, err := GetModule(m.UUID)
		if err != nil {
			return entry, err
		}
		entry.Modules[i] = mod
	}

	return entry, nil
}

func GetEntrypointBySlug(slug string, user_uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Preload("Modules").Preload("Users").Where("slug = ?", slug).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	return entry, nil
}

func GetAllEntrypoints(user_uuid uuid.UUID) ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Preload("Modules").Preload("Users").Find(&eps)
	return eps, result.Error
}

func GetEntrypointsByGeneration(gen int) ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Where("generation = ?", gen).Find(&eps)
	return eps, result.Error
}

func UpdateEntrypoint(uuid uuid.UUID, entry *Entrypoint) (Entrypoint, error) {
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
	if err != nil {
		return *entry, err
	}
	// Handle entrypoint status
	entry.Status = EntrypointPending

	// Handle partner status
	if len(entry.Users) < entry.MaxUsers {
		entry.PartnerStatus = PartnerPartial
	}
	if len(entry.Users) == entry.MaxUsers {
		entry.PartnerStatus = PartnerFull
	}
	_, err = UpdateEntrypoint(entry.UUID, entry)
	if err != nil {
		return *entry, err
	}

	updated, err := GetEntrypoint(entry.UUID)
	return updated, err
}

func DeleteEntrypoint(uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Where("uuid = ?", uuid).First(&entry)
	if result.Error != nil {
		return entry, result.Error
	}

	result = db.Where("uuid = ?", uuid).Delete(&entry)
	return entry, result.Error
}
