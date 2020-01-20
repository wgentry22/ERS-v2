package handlers

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/service"
  "net/http"
)

type userInfoHandler struct {
  userInfoService service.UserInfoService
}

type UserInfoHandler interface {
  Handler
  RetrieveUserInfo(w http.ResponseWriter, r *http.Request)
}

func (handler *userInfoHandler) Path() string {
  return V1API + "/info"
}

func (handler *userInfoHandler) RetrieveUserInfo(w http.ResponseWriter, r *http.Request) {
  defer recoverTokenContextNotInRequestContext(w, r)
  details := handler.userInfoService.RetrieveUserInfo(r.Context())
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(&details)
}

func UserInfo() UserInfoHandler {
  return &userInfoHandler{userInfoService:service.UserInfo()}
}
