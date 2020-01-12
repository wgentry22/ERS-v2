package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/service"
  "io/ioutil"
  "net/http"
)

type registrationHandler struct {
  registrationService service.RegistrationService
}

type RegistrationHandler interface {
  Handler
  AttemptRegistration(w http.ResponseWriter, r *http.Request)
}

func (handler *registrationHandler) AttemptRegistration(w http.ResponseWriter, r *http.Request) {
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  var form dto.RegistrationForm
  err = json.Unmarshal(body, &form)
  if err != nil {
    w.WriteHeader(http.StatusUnprocessableEntity)
    return
  }

  registrationResponse := handler.registrationService.AttemptRegistration(r.Context(), form)
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(registrationResponse.Status())
  json.NewEncoder(w).Encode(registrationResponse.Message())
}

func (handler *registrationHandler) Path() string {
  return "/register"
}

func Registration() RegistrationHandler {
  return &registrationHandler{registrationService:service.Registration()}
}
