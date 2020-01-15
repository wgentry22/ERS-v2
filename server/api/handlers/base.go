package handlers

const (
  V1API = "/api/v1"
)

type Handler interface {
  Path() string
}
