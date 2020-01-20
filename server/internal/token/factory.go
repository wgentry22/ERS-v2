package token

import (
  "context"
  "crypto/rsa"
  "errors"
  "fmt"
  "github.com/dgrijalva/jwt-go"
  "github.com/wgentry2/ers-ngrx/server/internal/domain/dto"
  "github.com/wgentry2/ers-ngrx/server/internal/logger"
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
  keyPair = KeyPair{
   signer:   getSignerKey(),
   verifier: getVerifierKey(),
  }
  testSignAndVerify()
}

func getSignerKey() *rsa.PrivateKey {
  pem, err := ioutil.ReadFile(config.SignerKeyPath)
  if err != nil {
    logger.Get().Warnf("Failed to read signer key PEM file: %+v\n", err)
    panic(err)
  }
  signer, err := jwt.ParseRSAPrivateKeyFromPEM(pem)
  if err != nil {
    logger.Get().Warnf("Failed to parse private key from file at %s: %+v\n", config.VerifierKeyPath, err)
    panic(err)
  }
  logger.Get().Infof("Successfully read private key from %s!", config.SignerKeyPath)
  return signer
}

func getVerifierKey() *rsa.PublicKey {
  pem, err := ioutil.ReadFile(config.VerifierKeyPath)
  if err != nil {
    logger.Get().Warnf("Failed to read verify key PEM file: %+v\n", err)
    panic(err)
  }
  verifier, err := jwt.ParseRSAPublicKeyFromPEM(pem)
  if err != nil {
    logger.Get().Warnf("Failed to parse public key from file at %s: %+v\n", config.VerifierKeyPath, err)
    panic(err)
  }
  logger.Get().Infof("Successfully read public key from %s!", config.VerifierKeyPath)
  return verifier
}

func Generate(username, role string, ctx context.Context) dto.Jwt {
  if username == "" && role == "" {
    panic(errors.New("Cannot generate JWT for empty credentials"))
  }
  claims := ErsClaim{
   StandardClaims: jwt.StandardClaims{
     ExpiresAt: time.Now().UTC().Add(1 * time.Hour).Unix(),
     IssuedAt:  time.Now().UTC().Unix(),
     Subject:   username,
   },
   Role:           role,
  }

  token := jwt.NewWithClaims(jwt.SigningMethodRS512, claims)
  tokenStr, err := token.SignedString(keyPair.signer)
  if err != nil {
   logger.WithContext(ctx).Warnf("Failed to sign JWT: %+v", err)
   panic(err)
  }
  return dto.Jwt{Token:tokenStr}
}

func Parse(tokenString string, ctx context.Context) (string, string) {
  tkn, err := jwt.ParseWithClaims(tokenString, &ErsClaim{}, func (token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
      return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
    }

    return keyPair.verifier, nil
  })

  if err != nil {
    logger.WithContext(ctx).Warnf("Failed to parse JWT", err)
    panic(err)
  }

  if claims, ok := tkn.Claims.(*ErsClaim); ok {
    return claims.Subject, claims.Role
  } else {
    panic(errors.New("Claims were not of type ErsClaim"))
  }
}


func testSignAndVerify() {
  token := Generate("Test", "Test", context.Background())
  username, role := Parse(token.Token, context.Background())
  if username != "Test" && role != "Test" {
    panic(fmt.Errorf("Failed to sign and verify test JWT."))
  }
  logger.Get().Info("Test sign/verify JWT is successful!")
}
