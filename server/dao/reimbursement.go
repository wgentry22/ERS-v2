package dao

import (
  "context"
  "errors"
  "fmt"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
)

type reimbursementDao struct {}

type ReimbursementDao interface {
  FindAll(ctx context.Context) []dto.ReimbursementDto
  FindMine(ctx context.Context) []dto.ReimbursementDto
  Create(ctx context.Context, form dto.ReimbursementForm) dto.ReimbursementDto
  Update(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto
  Resolve(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto
}

func (dao *reimbursementDao) FindAll(ctx context.Context) []dto.ReimbursementDto {
  var reimbursements []dto.ReimbursementDto
  if err := withContext(ctx).Table("reimbursements").Find(&reimbursements).Error; err != nil {
    logrus.Infof("Failed to read all reimbursements: %+v", err)
    return make([]dto.ReimbursementDto, 0)
  }
  return reimbursements
}

func (dao *reimbursementDao) FindMine(ctx context.Context) []dto.ReimbursementDto {
  var reimbursements []dto.ReimbursementDto
  username, _ := ctx.Value("username").(string)
  if err := withContext(ctx).Table("reimbursements").Find(&reimbursements, "username = ?", username).Error; err != nil {
    logrus.Info("Failed to execute FIND MINE query for %s", username)
    return make([]dto.ReimbursementDto, 0)
  }
  return reimbursements
}

func (dao *reimbursementDao) Create(ctx context.Context, form dto.ReimbursementForm) dto.ReimbursementDto {
  username, _ := ctx.Value("username").(string)
  var user model.User
  if err := withContext(ctx).Find(&user, "username = ?", username).Error; err != nil {
    logrus.Infof("Unable to create reimbursement: Failed to find user associated with %s", username)
    panic(errors.New(fmt.Sprintf("Failed to find user associated with username %s", username)))
  }
  reimbursement := model.Reimbursement{
    Amount:      form.Amount,
    Description: form.Description,
    Type:        form.Type,
    ExpenseDate: form.ExpenseDate,
    Status:      model.PENDING,
    CreatedBy:   username,
    UserId:      user.ID,
    User:        user,
  }
  
  if err := withContext(ctx).Save(&reimbursement).Error; err != nil {
    logrus.Infof("Failed to create reimbursement: %+v", reimbursement)
    panic(err)
  }
  
  return dto.ReimbursementDto{
    Id:             reimbursement.ID,
    Amount:         reimbursement.Amount,
    Description:    reimbursement.Description,
    Type:           reimbursement.Type,
    ExpenseDate:    reimbursement.ExpenseDate,
    ResolutionDate: reimbursement.ResolutionDate,
    Status:         reimbursement.Status,
    CreatedBy:      reimbursement.CreatedBy,
    ResolvedBy:     reimbursement.ResolvedBy,
  }
}

func (dao *reimbursementDao) Update(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto {
  var reimbursement model.Reimbursement
  if err := withContext(ctx).Find(&reimbursement, "id = ?", dto.Id).Error; err != nil {
    logrus.Infof("Failed to locate reimbursement with id [%d] to update", dto.Id)
    panic(err)
  }
  if err := withContext(ctx).Model(&reimbursement).Updates(model.Reimbursement{
    Amount:      dto.Amount,
    Description: dto.Description,
    Type:        dto.Type,
    ExpenseDate: dto.ExpenseDate,
  }).Error; err != nil {
    logrus.Infof("Failed to update reimbursement: %+v", reimbursement)
    panic(err)
  }
  return dto
}


func (dao *reimbursementDao) Resolve(ctx context.Context, dto dto.ReimbursementDto) dto.ReimbursementDto {
  var reimbursement model.Reimbursement
  if err := withContext(ctx).Find(&reimbursement, "id = ?", dto.Id).Error; err != nil {
    logrus.Infof("Failed to locate reimbursement with id [%d] to update", dto.Id)
    panic(err)
  }
  username, ok := ctx.Value("username").(string)
  if err := withContext(ctx).Model(&reimbursement).Updates(model.Reimbursement{
    Amount:      dto.Amount,
    Description: dto.Description,
    ExpenseDate: dto.ExpenseDate,
    ResolvedBy:  dto.ResolvedBy,
    ResolutionDate: dto.ResolutionDate,
    Status:      dto.Status,
  }).Error; err != nil && ok {
    logrus.Infof("Failed to update %s's reimbursement: %+v", username, reimbursement)
    panic(err)
  }
  return dto
}

func Reimbursement() ReimbursementDao {
  return &reimbursementDao{}
}
