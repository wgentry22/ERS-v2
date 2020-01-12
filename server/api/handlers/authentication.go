package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/service"
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
  token := handler.loginService.AttemptAuthentication(r.Context(), form)
  if r := recover(); r != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(&token)
}

func (handler *authHandler) Path() string {
  return "/login"
}

func Authentication() AuthenticationHandler {
  return &authHandler{loginService:service.Login()}
}
