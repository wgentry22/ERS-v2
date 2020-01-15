package handlers

import (
  "encoding/json"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/service"
  "io/ioutil"
  "net/http"
)

type reimbursementHandler struct {
  reimbursementService service.ReimbursementService
}

type ReimbursementHandler interface {
  Handler
  FindAll(w http.ResponseWriter, r *http.Request)
  FindMine(w http.ResponseWriter, r *http.Request)
  Create(w http.ResponseWriter, r *http.Request)
  Update(w http.ResponseWriter, r *http.Request)
  Resolve(w http.ResponseWriter, r *http.Request)
}

func (handler *reimbursementHandler) Path() string {
  return V1API + "/reimbursements"
}

func (handler *reimbursementHandler) FindAll(w http.ResponseWriter, r *http.Request) {
  reimbursements := handler.reimbursementService.FindAll(r.Context())
  if len(reimbursements) == 0 {
    w.WriteHeader(http.StatusNoContent)
  } else {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&reimbursements)
  }
}

func (handler *reimbursementHandler) FindMine(w http.ResponseWriter, r *http.Request) {
  defer recoverFromUsernameNotInRequestContext(w)
  reimbursements := handler.reimbursementService.FindMine(r.Context())
  if len(reimbursements) == 0 {
    w.WriteHeader(http.StatusNoContent)
  } else {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&reimbursements)
  }
}

func (handler *reimbursementHandler) Create(w http.ResponseWriter, r *http.Request) {
  defer recoverFromUsernameNotInRequestContext(w)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logrus.Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var form dto.ReimbursementForm
    err := json.Unmarshal(body, &form)
    if err != nil {
      logrus.Infof("Failed to marshal request body into dto.ReimbursementForm: %+v\n", err)
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      created := handler.reimbursementService.Create(r.Context(), form)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&created)
    }
  }
}

func (handler *reimbursementHandler) Update(w http.ResponseWriter, r *http.Request) {
  defer recoverFromUsernameNotInRequestContext(w)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logrus.Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var dto dto.ReimbursementDto
    err := json.Unmarshal(body, &dto)
    if err != nil {
      logrus.Info("Failed to marshal request body into dto.ReimbursementDto")
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      updated := handler.reimbursementService.Update(r.Context(), dto)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&updated)
    }
  }
}

func (handler *reimbursementHandler) Resolve(w http.ResponseWriter, r *http.Request) {
  defer recoverFromUsernameNotInRequestContext(w)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logrus.Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var dto dto.ReimbursementDto
    err := json.Unmarshal(body, &dto)
    if err != nil {
      logrus.Info("Failed to marshal request body into dto.ReimbursementDto")
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      updated := handler.reimbursementService.Resolve(r.Context(), dto)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&updated)
    }
  }
}

func recoverFromUsernameNotInRequestContext(w http.ResponseWriter) {
  if r := recover(); r != nil {
    logrus.Infof("Recovery from Username not in Request Context: %+v", r)
    w.WriteHeader(http.StatusForbidden)
    return
  }
}

func Reimbursement() ReimbursementHandler {
  return &reimbursementHandler{reimbursementService:service.Reimbursement()}
}
