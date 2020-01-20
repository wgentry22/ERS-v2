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
var userInfo handlers.UserInfoHandler
var awakeCheck handlers.AwakeCheckHandler

func init() {
  router = mux.NewRouter()
  authentication = handlers.Authentication()
  registration = handlers.Registration()
  healthCheck = handlers.HealthCheck()
  reimbursement = handlers.Reimbursement()
  userInfo = handlers.UserInfo()
  awakeCheck = handlers.Awake()
  bootstrap(router)
}

func bootstrap(router *mux.Router) {
  router.HandleFunc(authentication.Path(), middleware.Cors(authentication.AttemptAuthentication)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(registration.Path(), middleware.Cors(registration.AttemptRegistration)).Methods(http.MethodPost, http.MethodGet, http.MethodOptions)
  router.HandleFunc(healthCheck.Path(), healthCheck.HealthCheck).Methods(http.MethodGet)
  router.HandleFunc(healthCheck.Path(), awakeCheck.AwakeCheck).Methods(http.MethodGet)
  router.HandleFunc(reimbursement.Path() + "/mine", requiresRole(token.EmployeeRole, reimbursement.FindMine)).Methods(http.MethodGet, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), requiresRole(token.EmployeeRole, reimbursement.Create)).Methods(http.MethodPost, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), requiresRole(token.EmployeeRole, reimbursement.Update)).Methods(http.MethodPatch, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), requiresRole(token.ManagerRole, reimbursement.FindAll)).Methods(http.MethodGet, http.MethodOptions)
  router.HandleFunc(reimbursement.Path(), requiresRole(token.ManagerRole, reimbursement.Resolve)).Methods(http.MethodPut, http.MethodOptions)
  router.HandleFunc(userInfo.Path(), requiresRole(token.EmployeeRole,userInfo.RetrieveUserInfo)).Methods(http.MethodGet, http.MethodOptions)
  apmgorilla.Instrument(router)
}

func requiresToken(next http.HandlerFunc) http.HandlerFunc {
  return middleware.Cors(middleware.RequiresToken(next))
}

func requiresRole(role string, next http.HandlerFunc) http.HandlerFunc {
  return middleware.Cors(middleware.RequiresToken(middleware.HasRole(role, next)))
}

func Router() *mux.Router {
  return router
}
