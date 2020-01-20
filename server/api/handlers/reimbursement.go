package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
  "github.com/wgentry2/ers-ngrx/server/service"
  "go.elastic.co/apm"
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
  span, ctx := apm.StartSpan(r.Context(), "findAllReimbursements", "custom")
  defer span.End()
  reimbursements := handler.reimbursementService.FindAll(ctx)
  if len(reimbursements) == 0 {
    w.WriteHeader(http.StatusNoContent)
  } else {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&reimbursements)
  }
}

func (handler *reimbursementHandler) FindMine(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "findMyReimbursements", "custom")
  defer span.End()
  defer recoverTokenContextNotInRequestContext(w, r)
  reimbursements := handler.reimbursementService.FindMine(ctx)
  if len(reimbursements) == 0 {
    w.WriteHeader(http.StatusNoContent)
  } else {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&reimbursements)
  }
}

func (handler *reimbursementHandler) Create(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "createReimbursement", "custom")
  defer span.End()
  defer recoverTokenContextNotInRequestContext(w, r)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logger.WithContext(ctx).Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var form dto.ReimbursementForm
    err := json.Unmarshal(body, &form)
    if err != nil {
      logger.WithContext(ctx).Infof("Failed to marshal request body into dto.ReimbursementForm: %+v\n", err)
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      created := handler.reimbursementService.Create(ctx, form)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&created)
    }
  }
}

func (handler *reimbursementHandler) Update(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "updateReimbursement", "custom")
  defer span.End()
  defer recoverTokenContextNotInRequestContext(w, r)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logger.WithContext(ctx).Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var dto dto.ReimbursementDto
    err := json.Unmarshal(body, &dto)
    if err != nil {
      logger.WithContext(ctx).Info("Failed to marshal request body into dto.ReimbursementDto")
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      updated := handler.reimbursementService.Update(ctx, dto)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&updated)
    }
  }
}

func (handler *reimbursementHandler) Resolve(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "resolveReimbursement", "custom")
  defer span.End()
  defer recoverTokenContextNotInRequestContext(w, r)
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    logger.WithContext(r.Context()).Info("Failed to read request body")
    w.WriteHeader(http.StatusBadRequest)
  } else {
    var dto dto.ReimbursementDto
    err := json.Unmarshal(body, &dto)
    if err != nil {
      logger.WithContext(ctx).Info("Failed to marshal request body into dto.ReimbursementDto")
      w.WriteHeader(http.StatusUnprocessableEntity)
    } else {
      updated := handler.reimbursementService.Resolve(ctx, dto)
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(&updated)
    }
  }
}

func recoverTokenContextNotInRequestContext(w http.ResponseWriter, req *http.Request) {
  if r := recover(); r != nil {
    logger.WithContext(req.Context()).Infof("Recovery from Token Context not in Request Context: %+v", r)
    w.WriteHeader(http.StatusForbidden)
    return
  }
}

func Reimbursement() ReimbursementHandler {
  return &reimbursementHandler{reimbursementService:service.Reimbursement()}
}
