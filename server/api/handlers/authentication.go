package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "io/ioutil"
  "net/http"
)

type authHandler struct {
  loginDao dao.LoginDao
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
  details := handler.loginDao.AttemptAuthentication(r.Context(), form)
  if r := recover(); r != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(&details)
}

func (handler *authHandler) Path() string {
  return "/login"
}

func Authentication() AuthenticationHandler {
  return &authHandler{loginDao:dao.Login()}
}
