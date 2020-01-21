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
    logger.WithContext(r.Context()).Infof("Failed to read registration form request body")
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  var form dto.RegistrationForm
  err = json.Unmarshal(body, &form)
  if err != nil {
    logger.WithContext(r.Context()).Infof("Failed to marshal request body into dto.RegistrationForm")
    w.WriteHeader(http.StatusUnprocessableEntity)
    return
  }

  registrationResponse := handler.registrationService.AttemptRegistration(ctx, form)
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(registrationResponse.Status())
  json.NewEncoder(w).Encode(registrationResponse.Message())
}

func (handler *registrationHandler) UsernameAvailabilityCheck(w http.ResponseWriter, r *http.Request) {
  params := r.URL.Query()
  username := params.Get("username")
  logger.WithContext(r.Context()).Infof("Found 'username' query param: %s", username)
  if username != "" {
    span, ctx := apm.StartSpan(r.Context(), "usernameAvailability", "custom")
    defer span.End()
    if handler.registrationService.UsernameAvailabilityCheck(ctx, username) {
      w.WriteHeader(http.StatusOK)
      w.Header().Set("Content-Type", "application/json")
      return
    }
  }
  w.WriteHeader(http.StatusBadRequest)
}

func (handler *registrationHandler) Path() string {
  return "/register"
}

func Registration() RegistrationHandler {
  return &registrationHandler{registrationService:service.Registration()}
}
