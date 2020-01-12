package dao

import (
  "context"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "go.elastic.co/apm"
  "golang.org/x/crypto/bcrypt"
)

type loginDao struct {
}

type LoginDao interface {
  AttemptAuthentication(context context.Context, form dto.LoginForm) (string, string)
}

func (dao *loginDao) AttemptAuthentication(context context.Context, form dto.LoginForm) (string, string) {
  var user model.User
  span, ctx := apm.StartSpan(context, "attemptLogin", "custom")
  defer span.End()
  if err := withContext(ctx).Find(&user, "username = ?", form.Username).Error; err != nil {
    logrus.Debugf("Failed to locate user by username [%s]", form.Username)
    panic(err)
  }

  bcryptSpan, bcryptCtx := apm.StartSpan(ctx, "compareHashPassword", "custom")
  defer bcryptSpan.End()
  if err := bcrypt.CompareHashAndPassword(user.PwdHash, []byte(form.Password)); err != nil {
    logrus.Debugf("Invalid Credentials provided by [%s]", form.Username)
    panic(err)
  }

  roleSpan, roleCtx := apm.StartSpan(bcryptCtx, "findRole", "custom")
  defer roleSpan.End()
  var role model.Role
  if err := withContext(roleCtx).Find(&role, "user_id = ?", user.ID).Error; err != nil {
    logrus.Debugf("Failed to find role for user with username [%s]", form.Username)
    panic(err)
  }

  return user.Username, role.Name
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
