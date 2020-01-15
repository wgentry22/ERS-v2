package dto

import (
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
)

type ReimbursementForm struct {
  Amount float64 `json:"amount"`
  Description string `json:"description"`
  Type model.ReimbursementType `json:"type"`
  ExpenseDate int64 `json:"expenseDate"`
}

type ReimbursementDto struct {
  Id uint `json:"id"`
  Amount float64 `json:"amount"`
  Description string `json:"description"`
  Type model.ReimbursementType `json:"type"`
  ExpenseDate int64 `json:"expenseDate"`
  ResolutionDate int64 `json:"resolutionDate"`
  Status model.ReimbursementStatus `json:"status"`
  CreatedBy string `json:"createdBy"`
  ResolvedBy string `json:"resolvedBy"`
}
