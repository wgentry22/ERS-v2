package logger

import (
  "github.com/sirupsen/logrus"
  "os"
)

var logger = logrus.New()
var environment = os.Getenv("ENVIRONMENT")

func init() {
  logger.SetReportCaller(true)
}

func Info(message string) {
  logger.Info(message)
}

func Warning(message string) {
  logger.Warn(message)
}

func Debug(message string) {
  logger.Debug(message)
}
