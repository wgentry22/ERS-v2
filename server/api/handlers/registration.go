package handlers

import (
  "encoding/json"
  "github.com/gorilla/mux"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/service"
  "go.elastic.co/apm"
  "io/ioutil"
  "net/http"
)

type registrationHandler struct {
  registrationService service.RegistrationService
}

type RegistrationHandler interface {
  Handler
  AttemptRegistration(w http.ResponseWriter, r *http.Request)
  UsernameAvailabilityCheck(w http.ResponseWriter, r *http.Request)
}

func (handler *registrationHandler) AttemptRegistration(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "attemptRegistration", "custom")
  defer span.End()
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

  registrationResponse := handler.registrationService.AttemptRegistration(ctx, form)
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(registrationResponse.Status())
  json.NewEncoder(w).Encode(registrationResponse.Message())
}

func (handler *registrationHandler) UsernameAvailabilityCheck(w http.ResponseWriter, r *http.Request) {
  username, ok := mux.Vars(r)["username"]
  span, ctx := apm.StartSpan(r.Context(), "usernameAvailibility", "custom")
  defer span.End()
  if ok && handler.registrationService.UsernameAvailabilityCheck(ctx, username) {
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    return
  }
  w.WriteHeader(http.StatusBadRequest)
}

func (handler *registrationHandler) Path() string {
  return "/register"
}

func Registration() RegistrationHandler {
  return &registrationHandler{registrationService:service.Registration()}
}
