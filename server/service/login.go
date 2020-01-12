package service

import (
  "context"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
)

type loginService struct {
  loginDao dao.LoginDao
}

type LoginService interface {
  AttemptAuthentication(ctx context.Context, form dto.LoginForm) dto.Jwt
}

func (service *loginService) AttemptAuthentication(ctx context.Context, form dto.LoginForm) dto.Jwt {
  username, role := service.loginDao.AttemptAuthentication(ctx, form)
  return token.Generate(username, role)
}

func Login() LoginService {
  return &loginService{loginDao:dao.Login()}
}
