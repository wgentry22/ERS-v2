package dto

import (
  "fmt"
  "net/http"
)

type RegistrationForm struct {
  Username string `json:"username"`
  Password string `json:"password"`
  Firstname string `json:"firstname"`
  Lastname string `json:"lastname"`
  Department string `json:"department"`
  Position string `json:"position"`
}

type Message struct {
  Message string `json:"message"`
}

type RegistrationResponse interface {
  Status() int
  Message() Message
}

type SuccessfulRegistrationResponse struct {
  status int
  message Message
}

func (success *SuccessfulRegistrationResponse) Status() int {
  return success.status
}

func (success *SuccessfulRegistrationResponse) Message() Message {
  return success.message
}

type FailedRegistrationResponse struct {
  status int
  message Message
}

func (fail *FailedRegistrationResponse) Status() int {
  return fail.status
}

func (fail *FailedRegistrationResponse) Message() Message {
  return fail.message
}

func Success(username string) RegistrationResponse {
  return &SuccessfulRegistrationResponse{
    status:  http.StatusOK,
    message: Message{Message:fmt.Sprintf("%s registered successfully!", username)},
  }
}

func Failure(username string) RegistrationResponse {
  return &FailedRegistrationResponse{
    status:  http.StatusBadRequest,
    message: Message{Message:fmt.Sprintf("Failed to register %s", username)},
  }
}
