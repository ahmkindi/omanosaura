package handlers

import (
	"context"
	"fmt"
	"net/http"
	"net/smtp"
	"net/url"
	"omanosaura/internal/config"
	"omanosaura/internal/database"
	"omanosaura/internal/migrations"
	"time"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/ahmkindi/go-thawani"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	Email         Email
	Config        *config.Config
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

func CreateServer(ctx context.Context, cfg *config.Config) (*Server, error) {
	db, err := pgxpool.New(ctx, cfg.GetDBConnStr())
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err = migrations.Migrate(cfg.GetDBConnStr()); err != nil {
		return nil, fmt.Errorf("failed to migrate: %w", err)
	}

	firebaseApp, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create new firebase app: %w", err)
	}

	authClient, err := firebaseApp.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create new auth client: %w", err)
	}

	thawaniHost, err := url.Parse(cfg.ThawaniBaseUrl)
	if err != nil {
		return nil, fmt.Errorf("failed to parse thawani url: %w", err)
	}

	return &Server{
		Email: Email{
			Username: cfg.EmailUsername,
			Password: cfg.EmailPass,
			Auth:     smtp.PlainAuth("", cfg.EmailUsername, cfg.EmailPass, "smtppro.zoho.com"),
			Headers:  "MIME-version: 1.0;\nContent-Type: text/html;",
			SmtpURL:  "smtppro.zoho.com:587",
		},
		Queries:       database.New(db),
		DB:            db,
		AuthClient:    authClient,
		ThawaniClient: thawani.NewClient(&http.Client{Timeout: time.Second * 20}, thawaniHost, cfg.ThawaniApiKey, cfg.ThawaniPublishableKey),
		Config:        cfg,
	}, nil
}
