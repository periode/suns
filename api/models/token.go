package models

import (
	"time"

	"github.com/google/uuid"
	zero "github.com/periode/suns/api/logger"
	"gorm.io/gorm"
)

type Token struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UUID      uuid.UUID      `gorm:"uniqueIndex;type:uuid;primaryKey;default:uuid_generate_v4()" json:"uuid" yaml:"uuid"`
	UserID    uuid.UUID      `gorm:"type:uuid" yaml:"user_id" json:"user_id"`
}

func CreateToken(token_uuid uuid.UUID) (Token, error) {
	hash := uuid.New()
	token := Token{UUID: hash, UserID: token_uuid}
	result := db.Create(&token)
	return token, result.Error
}

// GetTokenUser takes a token and returns the full user associated with it
func GetTokenUser(token_uuid uuid.UUID) (User, error) {
	var user User
	var token Token

	result := db.Where("uuid = ?", token_uuid).First(&token)
	if result.Error != nil {
		zero.Error(result.Error.Error())
		return user, result.Error
	}

	user, err := GetUser(token.UserID)
	if err != nil {
		zero.Error(err.Error())
		return user, err
	}

	return user, err
}

func DeleteToken(token_uuid uuid.UUID) error {
	var token Token
	result := db.Where("uuid = ?", token_uuid).First(&token)
	if result.Error != nil {
		return result.Error
	}

	result = db.Where("uuid = ?", token_uuid).Delete(&token)
	return result.Error
}
