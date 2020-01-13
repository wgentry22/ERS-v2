package api

import (
  "github.com/gorilla/mux"
  "github.com/wgentry2/ers-ngrx/server/api/handlers"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "go.elastic.co/apm/module/apmgorilla"
  "net/http"
)

var router *mux.Router
var authentication handlers.AuthenticationHandler
var registration handlers.RegistrationHandler
var healthCheck handlers.HealthCheckHandler
var reimbursement handlers.ReimbursementHandler

func init() {
  router = mux.NewRouter()
  authentication = handlers.Authentication()
  registration = handlers.Registration()
  healthCheck = handlers.HealthCheck()
  reimbursement = handlers.Reimbursement()
  bootstrap(router)
}

func bootstrap(router *mux.Router) {
  router.HandleFunc(authentication.Path(), middleware.Cors(authentication.AttemptAuthentication)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(registration.Path(), middleware.Cors(registration.AttemptRegistration)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(healthCheck.Path(), healthCheck.HealthCheck).Methods(http.MethodGet)
  router.HandleFunc(reimbursement.Path() + "/mine", middleware.HasRole(token.EmployeeRole, middleware.Cors(reimbursement.FindMine))).Methods(http.MethodGet)
  router.HandleFunc(reimbursement.Path(), middleware.HasRole(token.EmployeeRole, middleware.Cors(reimbursement.Create))).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), middleware.HasRole(token.EmployeeRole, middleware.Cors(reimbursement.Update))).Methods(http.MethodPatch, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), middleware.HasRole(token.ManagerRole, middleware.Cors(reimbursement.FindAll))).Methods(http.MethodGet)
  router.HandleFunc(reimbursement.Path(), middleware.HasRole(token.ManagerRole, middleware.Cors(reimbursement.Resolve))).Methods(http.MethodPut, http.MethodOptions)
  apmgorilla.Instrument(router)
}

func Router() *mux.Router {
  return router
}
