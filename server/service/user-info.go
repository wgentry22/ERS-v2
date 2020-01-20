package service

import (
  "context"
  "errors"
  "fmt"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
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
  info, ok := ctx.Value("info").(middleware.TokenContext)
  if !ok {
    panic(errors.New("Failed to locate user info in current request context"))
  }
  username, usernameOk := info.Get("username")
  _, roleOk := info.Get("role")
  if usernameOk {
    if roleOk {
      return service.userInfoDao.GetUserInfo(ctx, username)
    } else {
      panic(fmt.Errorf("Failed to find role in TokenContext"))
    }
  } else {
    panic(fmt.Errorf("Failed to find username in TokenContext"))
  }
}

func UserInfo() UserInfoService {
  return &userInfoService{userInfoDao:dao.UserInfo()}
}
