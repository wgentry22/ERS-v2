package dao

import (
  "context"
  "fmt"
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/model"
  "go.elastic.co/apm/module/apmgorm"
  "log"
  "os"
)

var (
  db *gorm.DB
  host = getEnv("HOST", "localhost")
  port = getEnv("PORT", "3306")
  username = getEnv("MYSQL_USER", "ers-admin")
  password = getEnv("MYSQL_PASSWORD", "Password123!")
  database = getEnv("MYSQL_DATABASE", "ers_ngrx")
  connectionString = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port, database)
)

func init() {
  database, err := apmgorm.Open("mysql", connectionString)
  if err != nil {
    log.Fatalf("Failed to connect to database, %+v", err)
  }
  runMigrations(database)
  db = database
}

func runMigrations(db *gorm.DB) {
  db.AutoMigrate(model.User{}, model.Role{}, model.UserDetails{})
}

func getEnv(key string, defaultValue string) string {
  if value, ok := os.LookupEnv(key); ok {
    return value
  }
  return defaultValue
}

func withContext(ctx context.Context) *gorm.DB {
  return apmgorm.WithContext(ctx, db)
}
