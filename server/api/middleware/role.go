package middleware

import (
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
  "github.com/wgentry2/ers-ngrx/server/internal/security"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "net/http"
)

const ApiToken = "api_token"

func HasRole(desiredRole string, next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    if cookie, err := r.Cookie(ApiToken); err == nil && cookie.Value != "" {
      username, role := token.Parse(cookie.Value, r.Context())
      logger.WithContext(r.Context()).Infof("Found username %s with role %s", username, role)
      if security.IsRoleReachable(role, desiredRole) {
        next(w, r)
        return
      } else {
        logger.WithContext(r.Context()).Infof("%s (with %s) attempted to access protected endpoint", username, role)
        w.WriteHeader(http.StatusForbidden)
        return
      }
    } else {
      logger.WithContext(r.Context()).Infof("Cookie value was not present: %+v", err)
    }
    w.WriteHeader(http.StatusForbidden)
  }
}

