package dao

import (
  "context"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
)

type registrationDao struct {}

type RegistrationDao interface {
  AttemptRegistration(ctx context.Context, user model.User, userDetails model.UserDetails) dto.RegistrationResponse
}

func (dao *registrationDao) AttemptRegistration(ctx context.Context, user model.User, userDetails model.UserDetails) dto.RegistrationResponse {
  if err := withContext(ctx).Save(&user).Error; err != nil {
    logrus.Warnf("Failed to register user with username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }
  userDetails.UserId = user.ID
  userDetails.User = user
  
  if err := withContext(ctx).Save(&userDetails).Error; err != nil {
    logrus.Warnf("Failed to save user details for username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }
  
  role := model.Role{
    Name:   determineRole(userDetails),
    UserId: user.ID,
    User:   user,
  }

  if err := withContext(ctx).Save(&role).Error; err != nil {
    logrus.Warnf("Failed to save role for user with username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }

  return dto.Success(user.Username)
}

func determineRole(details model.UserDetails) string {
  if details.Position == "Manager" {
    return token.ManagerRole
  } else {
    return token.EmployeeRole
  }
}

func Registration() RegistrationDao {
  return &registrationDao{}
}
