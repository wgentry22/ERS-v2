package middleware

import (
  "context"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/security"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "net/http"
)

const ApiToken = "api_token"

func HasRole(desiredRole string, next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    if cookie, err := r.Cookie(ApiToken); err == nil && cookie.Value != "" {
      username, role := token.Parse(cookie.Value)
      logrus.Infof("Found username %s with role %s", username, role)
      if security.IsRoleReachable(role, desiredRole) {
        r = r.WithContext(context.WithValue(r.Context(), "username", username))
        next(w, r)
        return
      } else {
        logrus.Infof("%s attempting to access protected endpoint", username)
        w.WriteHeader(http.StatusForbidden)
        return
      }
    }
    w.WriteHeader(http.StatusForbidden)
  }
}

