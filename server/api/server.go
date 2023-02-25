package api

import (
	"context"
	"fmt"
	"net/http"
	"net/smtp"
	"net/url"
	"omanosaura/database"
	"omanosaura/migrations"
	"omanosaura/thawani"
	"os"
	"time"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Server struct {
	Email         Email
	Config        Config
	Queries       *database.Queries
	DB            *pgxpool.Pool
	AuthClient    *auth.Client
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
	connStr := fmt.Sprintf("host=db port=5432 user=%s password=%s dbname=postgres sslmode=disable", os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"))

	db, err := pgxpool.Connect(context.TODO(), connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err = migrations.Migrate(connStr); err != nil {
		return nil, fmt.Errorf("failed to migrate: %w", err)
	}
	username := os.Getenv("EMAIL_USERNAME")
	password := os.Getenv("EMAIL_PASSWORD")

	config := Config{
		ThawaniAPIKey:         os.Getenv("THAWANI_API_KEY"),
		ThawaniBaseUrl:        os.Getenv("THAWANI_BASE_URL"),
		ThawaniPublishableKey: os.Getenv("THAWANI_PUBLISHABLE_KEY"),
		BaseUrl:               os.Getenv("BASE_URL"),
	}

	firebaseApp, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create new firebase app: %w", err)
	}

	authClient, err := firebaseApp.Auth(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to create new auth client: %w", err)
	}

	thawaniHost, err := url.Parse(config.ThawaniBaseUrl)
	if err != nil {
		return nil, fmt.Errorf("failed to parse thawani url: %w", err)
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
		AuthClient:    authClient,
		ThawaniClient: thawani.NewClient(&http.Client{Timeout: time.Second * 20}, thawaniHost, config.ThawaniAPIKey, config.ThawaniPublishableKey),
		Config:        config,
	}, nil
}
