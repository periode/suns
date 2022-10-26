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

type Cluster struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:unlisted" json:"status"`

	Name string `gorm:"not null" json:"name" form:"name" binding:"required"`
	Slug string `gorm:"" json:"slug"`

	Lat float32 `json:"lat"`
	Lng float32 `json:"lng"`
}

func (c *Cluster) BeforeCreate(tx *gorm.DB) (err error) {
	sp := strings.Split(slug.Make(c.Name), "-")
	i := math.Min(float64(len(sp)), 5)

	c.Slug = fmt.Sprintf("%s-%s", strings.Join(sp[:int(i)], "-"), c.UUID.String()[:8])

	return nil
}

func CreateCluster(coll *Cluster) (Cluster, error) {
	//-- TODO: create cluster simply

	created := Cluster{}
	return created, nil
}

func GetCluster(uuid uuid.UUID, user_uuid uuid.UUID) (Cluster, error) {
	var coll Cluster
	result := db.Where("uuid = ? AND (status = 'listed' OR user_uuid = ?)", uuid, user_uuid).First(&coll)
	if result.Error != nil {
		return coll, result.Error
	}

	return coll, nil
}

func GetClusterBySlug(slug string, user_uuid uuid.UUID) (Cluster, error) {
	var coll Cluster
	result := db.Where("slug = ?", slug).First(&coll)
	if result.Error != nil {
		return coll, result.Error
	}

	return coll, nil
}

func GetAllClusters(user_uuid uuid.UUID) ([]Cluster, error) {
	coll := make([]Cluster, 0)
	result := db.Where("status = 'listed'").Find(&coll)
	return coll, result.Error
}

func UpdateCluster(uuid uuid.UUID, user_uuid uuid.UUID, coll *Cluster) (Cluster, error) {
	var existing Cluster
	result := db.Where("uuid = ?", uuid).First(&existing)
	if result.Error != nil {
		return *coll, result.Error
	}

	result = db.Model(&existing).Where("uuid = ?", uuid).Updates(&coll)
	return existing, result.Error
}

func DeleteCluster(uuid uuid.UUID, user_uuid uuid.UUID) (Cluster, error) {
	var coll Cluster
	result := db.Where("uuid = ?", uuid).First(&coll)
	if result.Error != nil {
		return coll, result.Error
	}

	result = db.Where("uuid = ?", uuid).Delete(&coll)
	return coll, result.Error
}
