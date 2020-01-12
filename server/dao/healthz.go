package dao

import (
  "context"
  "go.elastic.co/apm"
)

type healthCheckDao struct {}

type HealthCheckDao interface {
  HealthCheck(ctx context.Context) bool
}

func (dao *healthCheckDao) HealthCheck(ctx context.Context) bool {
  span, ctx := apm.StartSpan(ctx, "healthCheck", "custom")
  defer span.End()
  return withContext(ctx).DB().Ping() == nil
}

func HealthCheck() HealthCheckDao {
  return &healthCheckDao{}
}
