package api

import (
	"fmt"
	"net/smtp"
	"omanosaura/database"
	"omanosaura/migrations"
	"os"

	"github.com/jmoiron/sqlx"
)

type Server struct {
	Email   Email
	Queries *database.Queries
	DB      *sqlx.DB
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
	return &Server{
		Email: Email{
			Username: username,
			Password: password,
			Auth:     smtp.PlainAuth("", username, password, "smtppro.zoho.com"),
			Headers:  "MIME-version: 1.0;\nContent-Type: text/html;",
			SmtpURL:  "smtppro.zoho.com:587",
		},
		Queries: database.New(db),
		DB:      db,
	}, nil
}
