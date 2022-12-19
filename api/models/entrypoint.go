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
	zero "github.com/periode/suns/api/logger"
	"gorm.io/gorm"
)

const (
	// Status of Entrypoint with regards to completion
	EntrypointUnlisted   string = "unlisted"   // Entrypoint exists but is not displayed yet
	EntrypointOpen       string = "open"       // Entrypoint is ready to be claimed
	EntrypointPending    string = "pending"    // Entrypoint is claimed and someone is working on it
	EntrypointCompleted  string = "completed"  // Entrypoint has been completed
	EntrypointSacrificed string = "sacrificed" // Entrypoint has been sacrificed
)

const (
	// Status of Partners of the Entrypoint
	PartnerNone    string = "none"
	PartnerPartial string = "partial"
	PartnerFull    string = "full"
)

const (
	EntrypointVisible  string = "visible"
	EntrypointHidden   string = "hidden"
	EntrypointPersonal string = "personal" //-- only shown on the map to the user
)

const (
	// Type of Final module for layour
	FinalModuleTangled         string = "Tangled"
	FinalModuleTangledInverted string = "Tangled Inverted"
	FinalModuleSeparate        string = "Separate"
	// custom:
	FinalModuleCrack string = "Crack"
)

type Entrypoint struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`

	Name        string `gorm:"not null" json:"name" form:"name" binding:"required"`
	AirtableKey string `gorm:"not null;default:missing" json:"airtable_key" yaml:"airtable_key" binding:"required"`

	Slug          string `gorm:"" json:"slug"`
	Icon          string `gorm:"default:black.svg" json:"icon" yaml:"icon"`
	Generation    int    `gorm:"default:0" json:"generation"`
	SacrificeWave int    `gorm:"default:0" json:"sacrifice_wave"`
	Visibility    string `gorm:"default:visible" json:"visibility" yaml:"visibility"`

	//-- belongs to a cluster
	ClusterUUID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()" json:"cluster_uuid" yaml:"cluster_uuid"`
	Cluster     Cluster   `gorm:"foreignKey:ClusterUUID;references:UUID" json:"cluster"`

	//-- has many modules
	Modules         []Module `gorm:"foreignKey:EntrypointUUID;references:UUID" json:"modules"`
	CurrentModule   int      `gorm:"default:0" json:"current_module" form:"current_module"`
	FinalModuleType string   `gorm:"default:Separate" json:"final_module_type" yaml:"final_module_type" `

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

	lng, lat := generatePosition()
	e.Lat = lat
	e.Lng = lng

	return nil
}

const POSITION_DISTANCE = 50
const MAP_DIMENSION = 2500

// -- generatePosition generates a pair of coordinates that are guaranteed to not be closer to any other entrypoint than POSITION_DISTANCE
func generatePosition() (float32, float32) {
	var lng, lat float32

	//generate two numbers
	lng = rand.Float32()*(MAP_DIMENSION*0.9) + (MAP_DIMENSION * 0.05)
	lat = rand.Float32()*(MAP_DIMENSION*0.9) + (MAP_DIMENSION * 0.05)

	eps, err := GetAllEntrypoints()
	if err != nil {
		zero.Error(err.Error())
		return 0, 0
	}

	isTooClose := false
	for _, ep := range eps {
		if distance(lng, lat, ep.Lng, ep.Lat) < POSITION_DISTANCE {
			isTooClose = true
		}
	}

	if !isTooClose {
		return lng, lat
	} else {
		return generatePosition()
	}
}

func distance(y1 float32, x1 float32, y2 float32, x2 float32) float64 {
	dist := math.Sqrt(math.Pow(float64(x1-x2), 2) + math.Pow(float64(y1-y2), 2))
	return dist
}

func CreateEntrypoint(entry *Entrypoint) (Entrypoint, error) {
	result := db.Create(entry)
	return *entry, result.Error
}

func GetEntrypoint(uuid uuid.UUID) (Entrypoint, error) {
	var entry Entrypoint
	result := db.Preload("Cluster").Preload("Modules").Preload("Users").Where("uuid = ?", uuid).First(&entry)
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

func GetAllEntrypoints() ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Preload("Modules").Preload("Cluster").Preload("Users").Find(&eps)
	return eps, result.Error
}

// -- GetMapEntrypoints returns all entrypoints that are visible on the map and that have modules. It is used to generate the map, to find which entrypoints should be sacrificed, and to determine the creation of new entrypoints.
func GetMapEntrypoints() ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Preload("Modules").Preload("Cluster").Preload("Users").Where("visibility = ?", EntrypointVisible).Not("status = ?", EntrypointSacrificed).Find(&eps)

	final := make([]Entrypoint, 0)
	for _, ep := range eps {
		if len(ep.Modules) == 0 {
			// zero.Debugf("no modules on entrypoint: %s", ep.Name)
		} else {
			final = append(final, ep)
		}
	}

	return final, result.Error
}

// -- GetCrackEntrypoints returns all entrypoints associated with the Cracks cluster type
func GetCrackEntrypoints() ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Preload("Modules").Preload("Cluster").Preload("Users").Where("status = ?", EntrypointCompleted).Find(&eps)

	cracks := make([]Entrypoint, 0)
	for _, ep := range eps {
		if ep.Cluster.Name == "Cracks" {
			for i := 0; i < len(ep.Modules); i++ {
				if ep.Modules[i].Name == "Cracks - Donating a picture" {
					mod, err := GetModule(ep.Modules[i].UUID)
					if err != nil {
						return cracks, err
					}

					ep.Modules[i] = mod
				}
			}
			cracks = append(cracks, ep)
		}
	}
	return cracks, result.Error
}

func GetSacrificedEntrypoints() ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Preload("Cluster").Preload("Users").Where("status = ?", EntrypointSacrificed).Find(&eps)

	return eps, result.Error
}

func GetEntrypointsByGeneration(gen int) ([]Entrypoint, error) {
	eps := make([]Entrypoint, 0)
	result := db.Where("generation = ?", gen).Preload("Modules").Find(&eps)
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

	// Handle partner status
	if len(entry.Users) < entry.MaxUsers {
		entry.PartnerStatus = PartnerPartial
	}

	if len(entry.Users) == entry.MaxUsers {
		entry.PartnerStatus = PartnerFull
		entry.Status = EntrypointPending
	}
	_, err = UpdateEntrypoint(entry.UUID, entry)
	if err != nil {
		return *entry, err
	}

	updated, err := GetEntrypoint(entry.UUID)
	return updated, err
}

func SacrificeEntrypoint(uuid uuid.UUID) error {
	var entry Entrypoint
	err := db.Where("uuid = ?", uuid).First(&entry).Error
	if err != nil {
		return err
	}

	err = db.Model(&entry).Update("status", EntrypointSacrificed).Error
	return err
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
