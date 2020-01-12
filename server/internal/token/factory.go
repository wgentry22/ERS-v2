package token

import (
  "crypto/rsa"
  "errors"
  "fmt"
  "github.com/dgrijalva/jwt-go"
  "github.com/sirupsen/logrus"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/security"
  "io/ioutil"
  "time"
)

const (
  EmployeeRole = "ROLE_EMPLOYEE"
  ManagerRole = "ROLE_MANAGER"
)

var (
  config = security.Config()
  keyPair KeyPair
)

type KeyPair struct {
  signer *rsa.PrivateKey
  verifier *rsa.PublicKey
}

type ErsClaim struct {
  jwt.StandardClaims
  Role string `json:"role"`
}

func init() {
  keyPair = getKeyPair(config.KeyPath)
}

func getKeyPair(filepath string) KeyPair {
  pubBytes, err := ioutil.ReadFile(fmt.Sprintf("%s.pub", filepath))
  if err != nil {
    logrus.Warnf("Failed to read public key file at %s", filepath)
    panic(err)
  }
  privBytes, err := ioutil.ReadFile(fmt.Sprintf("%s.rsa", filepath))
  if err != nil {
    logrus.Warnf("Failed to read private key file at %s", filepath)
    panic(err)
  }
  verifier, err := jwt.ParseRSAPublicKeyFromPEM(pubBytes)
  if err != nil {
   logrus.Warnf("Failed to parse public key from file at %s", filepath)
   panic(err)
  }
  signer, err := jwt.ParseRSAPrivateKeyFromPEM(privBytes)
  if err != nil {
   logrus.Warnf("Failed to parse private key file at %s", filepath)
   panic(err)
  }
  return KeyPair{
   signer: signer,
   verifier: verifier,
  }
}

func Generate(username, role string) dto.Jwt {
  if username == "" && role == "" {
    panic(errors.New("Cannot generate JWT for empty credentials"))
  }
  claims := ErsClaim{
    StandardClaims: jwt.StandardClaims{
      ExpiresAt: time.Now().Add(15 * time.Minute).Unix(),
      IssuedAt:  time.Now().Unix(),
      Subject:   username,
    },
    Role:           role,
  }

  token := jwt.NewWithClaims(jwt.SigningMethodRS512, claims)
  tokenStr, err := token.SignedString(keyPair.signer)
  if err != nil {
    logrus.Warnf("Failed to sign JWT: %+v", err)
    panic(err)
  }
  return dto.Jwt{Token:tokenStr}
}

func Parse(tokenString string) (string, string) {
  tkn, err := jwt.ParseWithClaims(tokenString, &ErsClaim{}, func (token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
      return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
    }
    return keyPair.verifier, nil
  })
  if err != nil {
    logrus.Warnf("Failed to parse JWT", err)
    panic(errors.New("Failed to parse JWT"))
  }
  if tkn.Valid {
    if claims, ok := tkn.Claims.(*ErsClaim); ok {
      return claims.Subject, claims.Role
    } else {
      panic(errors.New("Claims were not of type ErsClaim"))
    }
  } else {
    panic(errors.New("Token was not valid"))
  }
}

