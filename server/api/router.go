package api

import (
  "github.com/gorilla/mux"
  "github.com/wgentry2/ers-ngrx/server/api/handlers"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
  "net/http"
)

var router *mux.Router
var authenticationHandler handlers.AuthenticationHandler
var registrationHandler handlers.RegistrationHandler
var healthCheck handlers.HealthCheckHandler

func init() {
  router = mux.NewRouter()
  authenticationHandler = handlers.Authentication()
  registrationHandler = handlers.Registration()
  healthCheck = handlers.HealthCheck()
  bootstrap(router)
}

func bootstrap(router *mux.Router) {
  router.HandleFunc(authenticationHandler.Path(), middleware.Cors(authenticationHandler.AttemptAuthentication)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(registrationHandler.Path(), middleware.Cors(registrationHandler.AttemptRegistration)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(healthCheck.Path(), healthCheck.HealthCheck).Methods(http.MethodGet)
}

func Router() *mux.Router {
  return router
}
