package dao

import (
  "context"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
)

type registrationDao struct {}

type RegistrationDao interface {
  AttemptRegistration(ctx context.Context, user model.User, userDetails model.UserDetails) dto.RegistrationResponse
  UsernameAvailabilityCheck(ctx context.Context, username string) bool
}

func (dao *registrationDao) AttemptRegistration(ctx context.Context, user model.User, userDetails model.UserDetails) dto.RegistrationResponse {
  if err := withContext(ctx).Save(&user).Error; err != nil {
    logger.WithContext(ctx).Warnf("Failed to register user with username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }
  userDetails.UserId = user.ID
  userDetails.User = user
  
  if err := withContext(ctx).Save(&userDetails).Error; err != nil {
    logger.WithContext(ctx).Warnf("Failed to save user details for username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }
  
  role := model.Role{
    Name:   determineRole(userDetails),
    UserId: user.ID,
    User:   user,
  }

  if err := withContext(ctx).Save(&role).Error; err != nil {
    logger.WithContext(ctx).Warnf("Failed to save role for user with username %s: %+v", user.Username, err)
    return dto.Failure(user.Username)
  }

  return dto.Success(user.Username)
}

func (dao *registrationDao) UsernameAvailabilityCheck(ctx context.Context, username string) bool {
  var users []model.User
  if err := withContext(ctx).Select("username").Find(&users, "username = ?", username).Error; err != nil {
    logger.WithContext(ctx).Infof("Failed to find all users by username")
    panic(err)
  }
  return len(users) == 0
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
