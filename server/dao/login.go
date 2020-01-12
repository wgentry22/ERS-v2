package dao

import (
  "context"
  "fmt"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "github.com/wgentry2/ers-ngrx/server/logger"
)

type loginDao struct {
}

type LoginDao interface {
  AttemptAuthentication(context context.Context, form dto.LoginForm) string
}

func (dao *loginDao) AttemptAuthentication(context context.Context, form dto.LoginForm) string {
  var user model.User
  if err := withContext(context).Find(&user, "username = ?", form.Username).Error; err != nil {
    logger.Debug(fmt.Sprintf("Failed to locate user by username [%s]", form.Username))
    panic(err)
  }
  return user.Username
  //var details model.UserDetails
  //if err := withContext(context).Find(&details, "user_id = ?", user.ID).Error; err != nil {
  //  logger.Debug(fmt.Sprintf("Failed to locate user details for user with username [%s]", form.Username))
  //  panic(err)
  //}
  //return dto.UserDetails{
  //  Username:   user.Username,
  //  Email:      details.Email,
  //  Department: details.Department,
  //  Position:   details.Position,
  //}
}

func Login() LoginDao {
  return &loginDao{}
}
