package dao

import (
  "context"
  "fmt"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
)

type userInfoDao struct {}

type UserInfoDao interface {
  GetUserInfo(ctx context.Context, username string) dto.UserDetails
}

func (dao *userInfoDao) GetUserInfo(ctx context.Context, username string) dto.UserDetails {
  var details dto.UserDetails
  if err := withContext(ctx).Table("user_details").Joins("INNER JOIN users ON users.id = users.id AND users.username = ?", username).Scan(&details).Error; err != nil {
    logger.WithContext(ctx).Infof("Failed to retrieve user info for username [%s]: %+v", username, err)
    panic(err)
  }
  details.Username = username
  info, ok := ctx.Value("info").(middleware.TokenContext)
  if !ok {
    logger.WithContext(ctx).Infof("Failed to retrieve role for user with username [%s]: %+v", username)
    panic(fmt.Errorf("Unable to grab user role from request context"))
  }
  role, _ := info.Get("role")
  details.Role = role
  return details
}

func UserInfo() UserInfoDao {
  return &userInfoDao{}
}
