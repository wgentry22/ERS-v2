package handlers

import (
  "github.com/wgentry2/ers-ngrx/server/dao"
  "net/http"
)

type healthCheckHandler struct {
  healthCheckDao dao.HealthCheckDao
}

type HealthCheckHandler interface {
  Handler
  HealthCheck(w http.ResponseWriter, r *http.Request)
}

func (handler *healthCheckHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
  if handler.healthCheckDao.HealthCheck(r.Context()) {
    w.WriteHeader(http.StatusOK)
  } else {
    w.WriteHeader(http.StatusBadRequest)
  }
}

func (handler *healthCheckHandler) Path() string {
  return "/healthz"
}

func HealthCheck() HealthCheckHandler {
  return &healthCheckHandler{healthCheckDao:dao.HealthCheck()}
}
