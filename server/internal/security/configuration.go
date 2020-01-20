package security

import (
  "encoding/json"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
  "io/ioutil"
  "os"
)

var (
  defaultFilepath = "/server/internal/security/security.json"
  config Configuration
)

type Configuration struct {
  SignerKeyPath string   `json:"signerKeyPath"`
  VerifierKeyPath string `json:"verifyKeyPath"`
  Roles         []string `json:"roleHierarchy"`
  RoleHierarchy map[string][]string
}

func init() {
  wd, _ := os.Getwd()
  filepath, ok := os.LookupEnv("SECURITY_CONFIG_JSON")
  if ok {
    data, err := ioutil.ReadFile(filepath)
    handleErrorIfFileNotFound(filepath, err)
    handleJsonUnmarshal(data, &config)
  } else {
    data, err := ioutil.ReadFile(wd + defaultFilepath)
    handleErrorIfFileNotFound(wd + defaultFilepath, err)
    handleJsonUnmarshal(data, &config)
  }

  config.RoleHierarchy = generateRoleHierarchy(config.Roles)
}

func handleErrorIfFileNotFound(filepath string, err error) {
  if err != nil {
    logger.Get().Warnf("Failed to locate security.json at [%s] - %+v\n", filepath, err)
    panic(err)
  }
}

func handleJsonUnmarshal(data []byte, kind interface{}) {
  err := json.Unmarshal(data, &kind)
  if err != nil {
    logger.Get().Warnf("Unable to unmarshal security configuration JSON - %+v\n", err)
    panic(err)
  }
}

func generateRoleHierarchy(roles []string) map[string][]string {
  hierarchy := make(map[string][]string)
  for i, role := range roles {
    hierarchy[role] = roles[i:]
  }
  return hierarchy
}

func IsRoleReachable(actual, desired string) bool {
  isReachable := false
  if roles, ok := config.RoleHierarchy[actual]; ok {
    for _, role := range roles {
      if role == desired {
        isReachable = true
      }
    }
  }
  return isReachable
}

func Config() Configuration {
  return config
}
