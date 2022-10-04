package models

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const (
	UserPending   string = "pending"
	UserConfirmed string = "confirmed"
	UserDeleted   string = "deleted"
)

type User struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	Status    string         `gorm:"default:pending" json:"status"`

	Bio      string `json:"bio" form:"bio"`
	Email    string `gorm:"unique;not null" json:"email" form:"email"`
	Name     string `gorm:"default:Anonymous User;not null" json:"name" form:"name"`
	Slug     string `gorm:"" json:"slug"`
	Password []byte `gorm:"not null" json:"password"`

	Collections []Collection `gorm:"foreignKey:UserUUID;references:UUID" json:"collections"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	s := strings.Split(slug.Make(u.Name), "-")
	i := math.Min(float64(len(s)), 5)

	u.Slug = fmt.Sprintf("%s-%s", strings.Join(s[:int(i)], "-"), u.UUID.String()[:8])

	return nil
}

func CreateUser(user *User) (User, error) {
	result := db.Create(user)
	return *user, result.Error
}

func GetUser(uuid uuid.UUID, user_uuid uuid.UUID) (User, error) {
	var user User
	err := db.Preload("Collections").Where("uuid = ?", uuid).First(&user).Error
	if err != nil {
		return user, err
	}

	return user, err
}

func GetUserByEmail(email string, user_uuid uuid.UUID) (User, error) {
	var user User
	err := db.Preload("Collections").Where("email = ?", email).Find(&user).Error
	if err != nil {
		return user, err
	}

	return user, err
}

func GetUserBySlug(slug string, user_uuid uuid.UUID) (User, error) {
	var user User
	err := db.Preload("Collections").Where("slug = ?", slug).Find(&user).Error
	if err != nil {
		return user, err
	}

	return user, err
}

func GetAllUsers() ([]User, error) {
	users := make([]User, 0)
	result := db.Find(&users)
	return users, result.Error
}

func UpdateUser(uuid uuid.UUID, user_uuid uuid.UUID, user *User) (User, error) {
	var existing User
	result := db.Where("uuid = ? AND uuid = ?", uuid, user_uuid).First(&existing)
	if result.Error != nil {
		return *user, result.Error
	}

	result = db.Model(&existing).Where("uuid = ?", uuid).Updates(user)

	return existing, result.Error
}

func DeleteUser(uuid uuid.UUID, user_uuid uuid.UUID) (User, error) {
	var user User
	result := db.Where("uuid = ? AND uuid = ?", uuid, user_uuid).First(&user)
	if result.Error != nil {
		return user, result.Error
	}
	result = db.Select(clause.Associations).Where("uuid = ?", uuid).Delete(&user)

	return user, result.Error
}
