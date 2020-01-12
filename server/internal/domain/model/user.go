package model

import "github.com/jinzhu/gorm"

type User struct {
  gorm.Model
  Username string `gorm:"unique,not_null"`
  PwdHash []byte `gorm:"not_null"`
}

type UserDetails struct {
  gorm.Model
  Position string
  Department string
  Email string
  FirstName string
  LastName string
  UserId int
  User User
}
