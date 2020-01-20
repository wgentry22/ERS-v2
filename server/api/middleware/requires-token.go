package middleware

import (
  "context"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "net/http"
)

const apiToken = "api_token"

func RequiresToken(next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    cookie, err := r.Cookie(apiToken)
    if err != nil {
      logger.WithContext(r.Context()).Warnf("Failed to read cookie %s: %+v", apiToken, err)
      w.WriteHeader(http.StatusForbidden)
      return
    }
    username, role := token.Parse(cookie.Value, r.Context())
    info := TokenContext{values: map[string]string{"username": username, "role": role} }
    ctx := context.WithValue(r.Context(), "info", info)
    r = r.Clone(ctx)
    next(w, r)
  }
}

type TokenContext struct {
  values map[string]string
}

func (t *TokenContext) Get(key string) (string, bool) {
  value, ok := t.values[key]
  return value, ok
}
