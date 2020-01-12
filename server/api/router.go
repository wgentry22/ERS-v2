package api

import (
  "github.com/gorilla/mux"
  "github.com/wgentry2/ers-ngrx/server/api/handlers"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
  "net/http"
)

var router *mux.Router
var authenticationHandler handlers.AuthenticationHandler

func init() {
  router = mux.NewRouter()
  authenticationHandler = handlers.Authentication()

  bootstrap(router)
}

func bootstrap(router *mux.Router) {
  router.HandleFunc(authenticationHandler.Path(), middleware.Cors(authenticationHandler.AttemptAuthentication)).Methods(http.MethodPost, http.MethodOptions)
}

func Router() *mux.Router {
  return router
}
