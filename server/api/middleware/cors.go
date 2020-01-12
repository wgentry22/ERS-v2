package middleware

import "net/http"

func Cors(next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusOK)
      w.Header().Set("Access-Control-Allow-Headers", "Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credential, Access-Control-Allow-Headers")
      w.Header().Set("Access-Control-Allow-Origin", r.Host)
      w.Header().Set("Access-Control-Allow-Credential", "true")
      w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, OPTIONS")
      return
    }
    next(w, r)
  }
}
