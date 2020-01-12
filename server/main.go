package main

import (
  "github.com/wgentry2/ers-ngrx/server/api"
  "log"
  "net/http"
)

func main() {
  router := api.Router()
  log.Fatal(http.ListenAndServe(":8080", router))
}
