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

type authHandler struct {
  loginService service.LoginService
}

type AuthenticationHandler interface {
  Handler
  AttemptAuthentication(w http.ResponseWriter, r *http.Request)
}

func (handler *authHandler) AttemptAuthentication(w http.ResponseWriter, r *http.Request) {
  span, ctx := apm.StartSpan(r.Context(), "attemptAuthentication", "custom")
  defer span.End()
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  var form dto.LoginForm
  err = json.Unmarshal(body, &form)
  if err != nil {
    w.WriteHeader(http.StatusUnprocessableEntity)
    return
  }
  defer recoverFromInvalidLoginAttempt(form, w, r)
  token := handler.loginService.AttemptAuthentication(ctx, form)
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(&token)
}

func (handler *authHandler) Path() string {
  return "/login"
}

func Authentication() AuthenticationHandler {
  return &authHandler{loginService:service.Login()}
}

func recoverFromInvalidLoginAttempt(form dto.LoginForm, w http.ResponseWriter, req *http.Request) {
  if r := recover(); r != nil {
    logger.WithContext(req.Context()).Infof("Failed to find user with credentials %+v", form)
    w.WriteHeader(http.StatusBadRequest)
    json.NewEncoder(w).Encode(&dto.Message{Message: "Invalid Credentials"})
    return
  }
}
