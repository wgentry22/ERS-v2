package dao

import (
  "context"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
)

type userInfoDao struct {}

type UserInfoDao interface {
  GetUserInfo(ctx context.Context, username string) dto.UserDetails
}

func (dao *userInfoDao) GetUserInfo(ctx context.Context, username string) dto.UserDetails {
  var details dto.UserDetails
  if err := withContext(ctx).Table("user_details").Joins("INNER JOIN users ON users.id = users.id AND users.username = ?", username).Scan(&details).Error; err != nil {
    logrus.Infof("Failed to retrieve user info for username [%s]: %+v", username, err)
    panic(err)
  }
  details.Username = username
  return details
}

func UserInfo() UserInfoDao {
  return &userInfoDao{}
}
