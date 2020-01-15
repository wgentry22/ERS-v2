package model

import (
  "github.com/jinzhu/gorm"
)

type ReimbursementType int

const (
  LODGING ReimbursementType = iota
  FLIGHT
  GAS
  FOOD
  CERTIFICATE
)

type ReimbursementStatus int

const (
  PENDING ReimbursementStatus = iota
  APPROVED
  REJECTED
)

type Reimbursement struct {
  gorm.Model
  Amount float64
  Description string
  Type ReimbursementType
  ExpenseDate int64
  ResolutionDate int64
  Status ReimbursementStatus
  CreatedBy string
  ResolvedBy string
  UserId uint
  User User
}

