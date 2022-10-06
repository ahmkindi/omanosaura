package api

import (
	"fmt"
	"net/http"
	"net/smtp"
	"net/url"
	"omanosaura/database"
	"omanosaura/migrations"
	"omanosaura/thawani"
	"os"
	"time"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/jmoiron/sqlx"
)

type Server struct {
	Email         Email
	Config        Config
	Queries       *database.Queries
	DB            *sqlx.DB
	FusionClient  *fusionauth.FusionAuthClient
	Store         *session.Store
	ThawaniClient *thawani.ThawaniClient
}

type Email struct {
	Username string
	Password string
	Auth     smtp.Auth
	Headers  string
	SmtpURL  string
}

func CreateServer() (*Server, error) {
	connStr := fmt.Sprintf(
		"postgres://%v:%v@%v/?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
	)

	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err = migrations.Migrate(db.DB); err != nil {
		return nil, fmt.Errorf("failed to migrate: %w", err)
	}
	username := os.Getenv("EMAIL_USERNAME")
	password := os.Getenv("EMAIL_PASSWORD")

	config := Config{
		FusionClientID:        os.Getenv("FUSION_CLIENT_ID"),
		FusionClientSecret:    os.Getenv("FUSION_CLIENT_SECRET"),
		FusionRedirectURI:     os.Getenv("FUSION_REDIRECT_URI"),
		FusionApplicationID:   os.Getenv("FUSION_APPLICATION_ID"),
		FusionAPIKey:          os.Getenv("FUSION_API_KEY"),
		ThawaniAPIKey:         os.Getenv("THAWANI_API_KEY"),
		ThawaniBaseUrl:        os.Getenv("THAWANI_BASE_URL"),
		ThawaniPublishableKey: os.Getenv("THAWANI_PUBLISHABLE_KEY"),
		BaseUrl:               os.Getenv("BASE_URL"),
	}

	fusionauthHost, err := url.Parse("http://fusionauth:9011")
	if err != nil {
		return nil, fmt.Errorf("failed to parse fusion auth url", err)
	}

	thawaniHost, err := url.Parse(config.ThawaniBaseUrl)
	if err != nil {
		return nil, fmt.Errorf("failed to parse thawani url", err)
	}

	return &Server{
		Email: Email{
			Username: username,
			Password: password,
			Auth:     smtp.PlainAuth("", username, password, "smtppro.zoho.com"),
			Headers:  "MIME-version: 1.0;\nContent-Type: text/html;",
			SmtpURL:  "smtppro.zoho.com:587",
		},
		Queries:       database.New(db),
		DB:            db,
		FusionClient:  fusionauth.NewClient(&http.Client{Timeout: time.Second * 10}, fusionauthHost, config.FusionAPIKey),
		ThawaniClient: thawani.NewClient(&http.Client{Timeout: time.Second * 20}, thawaniHost, config.ThawaniAPIKey, config.ThawaniPublishableKey),
		Config:        config,
		Store:         session.New(),
	}, nil
}
