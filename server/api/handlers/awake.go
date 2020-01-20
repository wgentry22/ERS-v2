package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "net/http"
)

type awakeCheckHandler struct {}

type AwakeCheckHandler interface {
  Handler
  AwakeCheck(w http.ResponseWriter, r *http.Request)
}

func (handler *awakeCheckHandler) Path() string {
  return "/awakez"
}

func (handler *awakeCheckHandler) AwakeCheck(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(http.StatusOK)
  json.NewEncoder(w).Encode(dto.Message{Message:"AWAKE"})
}

func Awake() AwakeCheckHandler {
  return &awakeCheckHandler{}
}
