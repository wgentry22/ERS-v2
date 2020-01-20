package service

import (
  "context"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/token"
  "go.elastic.co/apm"
)

type loginService struct {
  loginDao dao.LoginDao
}

type LoginService interface {
  AttemptAuthentication(ctx context.Context, form dto.LoginForm) dto.Jwt
}

func (service *loginService) AttemptAuthentication(ctx context.Context, form dto.LoginForm) dto.Jwt {
  username, role := service.loginDao.AttemptAuthentication(ctx, form)
  span, context := apm.StartSpan(ctx, "generateJwt", "custom")
  defer span.End()
  return token.Generate(username, role, context)
}

func Login() LoginService {
  return &loginService{loginDao:dao.Login()}
}
