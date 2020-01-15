package service

import (
  "context"
  "fmt"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "golang.org/x/crypto/bcrypt"
  "strings"
)

type registrationService struct {
  registrationDao dao.RegistrationDao
}

type RegistrationService interface {
  AttemptRegistration(ctx context.Context, form dto.RegistrationForm) dto.RegistrationResponse
}

func (service *registrationService) AttemptRegistration(ctx context.Context, form dto.RegistrationForm) dto.RegistrationResponse {
  hashedPwd, err := bcrypt.GenerateFromPassword([]byte(form.Password), 13)
  if err != nil {
    logrus.Warnf("Failed to hash password: %+v", err)
    panic(err)
  }
  user := model.User{
    Username: form.Username,
    PwdHash:  hashedPwd,
  }
  userDetails := model.UserDetails{
    Position:   form.Position,
    Department: form.Department,
    Email:      formatEmail(form),
    FirstName:  form.Firstname,
    LastName:   form.Lastname,
  }

  return service.registrationDao.AttemptRegistration(ctx, user, userDetails)
}

func formatEmail(form dto.RegistrationForm) string {
  return fmt.Sprintf("%s.%s@ers.io", strings.ToLower(form.Firstname), strings.ToLower(form.Lastname))
}

func Registration() RegistrationService {
  return &registrationService{registrationDao:dao.Registration()}
}
