package service

import (
  "context"
  "fmt"
  "github.com/wgentry2/ers-ngrx/server/api/middleware"
  "github.com/wgentry2/ers-ngrx/server/dao"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "go.elastic.co/apm"
)

type reimbursementService struct {
  reimDao dao.ReimbursementDao
}

type ReimbursementService interface {
  FindAll(ctx context.Context) []dto.ReimbursementDto
  FindMine(ctx context.Context) []dto.ReimbursementDto
  Create(ctx context.Context, form dto.ReimbursementForm) dto.ReimbursementDto
  Update(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto
  Resolve(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto
}

func (service *reimbursementService) FindAll(ctx context.Context) []dto.ReimbursementDto {
  span, context := apm.StartSpan(ctx, "findAllReimbursements", "custom")
  defer span.End()
  return service.reimDao.FindAll(context)
}

func (service *reimbursementService) FindMine(ctx context.Context) []dto.ReimbursementDto {
  _, ok := ctx.Value("info").(middleware.TokenContext)
  if ok {
    span, context := apm.StartSpan(ctx, "findMyReimbursements", "custom")
    defer span.End()
    return service.reimDao.FindMine(context)
  } else {
    panic(fmt.Errorf("Failed to find username in request context"))
  }
}

func (service *reimbursementService) Create(ctx context.Context, form dto.ReimbursementForm) dto.ReimbursementDto {
  _, ok := ctx.Value("info").(middleware.TokenContext)
  if ok {
    span, context := apm.StartSpan(ctx, "createReimbursement", "custom")
    defer span.End()
    return service.reimDao.Create(context, form)
  } else {
    panic(fmt.Errorf("Failed to find username in token context"))
  }
}

func (service *reimbursementService) Update(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto {
  span, context := apm.StartSpan(ctx, "updateReimbursement", "custom")
  defer span.End()
  return service.reimDao.Update(context, dto)
}

func (service *reimbursementService) Resolve(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto {
  info, ok := ctx.Value("info").(middleware.TokenContext)
  if ok {
    username, usernameOk := info.Get("username")
    if usernameOk {
      if dto.CreatedBy == username {
        panic(fmt.Errorf("This reimbursement requires another manager to resolve as %s created it", dto.CreatedBy))
      }
      return service.reimDao.Resolve(ctx, dto)
    }
  }
  panic(fmt.Errorf("Failed to find username in request context"))
}

func Reimbursement() ReimbursementService {
  return &reimbursementService{reimDao:dao.Reimbursement()}
}
