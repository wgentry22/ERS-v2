package service

import (
  "context"
  "errors"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
)

type userInfoService struct {
  userInfoDao dao.UserInfoDao
}

type UserInfoService interface {
  RetrieveUserInfo(ctx context.Context) dto.UserDetails
}

func (service *userInfoService) RetrieveUserInfo(ctx context.Context) dto.UserDetails {
  username, ok := ctx.Value("username").(string)
  if !ok {
    panic(errors.New("Failed to locate username in current request context"))
  }
  return service.userInfoDao.GetUserInfo(ctx, username)
}

func UserInfo() UserInfoService {
  return &userInfoService{userInfoDao:dao.UserInfo()}
}
