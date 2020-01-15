package middleware

import (
  "context"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "net/http"
)

const apiToken = "api_token"

func RequiresToken(next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    cookie, err := r.Cookie(apiToken)
    if err != nil {
      w.WriteHeader(http.StatusForbidden)
      return
    }
    username, role := token.Parse(cookie.Value)
    ctx := context.WithValue(r.Context(), "username", username)
    ctx = context.WithValue(ctx, "role", role)
    r = r.WithContext(ctx)
    next(w, r)
  }
}
