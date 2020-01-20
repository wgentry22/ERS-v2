package logger

import (
  "context"
  "github.com/sirupsen/logrus"
  "sync"
)

var logger *logrus.Logger
var once sync.Once

func init() {
  once.Do(initLogrus)
}

func initLogrus() {
  logger = logrus.New()
  logger.SetFormatter(&logrus.JSONFormatter{
    DisableTimestamp: false,
    PrettyPrint:      true,
  })
  logger.SetReportCaller(true)
}

func WithContext(ctx context.Context) *logrus.Entry {
  return logger.WithContext(ctx)
}

func Get() *logrus.Logger {
  return logger
}
