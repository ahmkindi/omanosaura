package api

import (
	"time"

	"github.com/google/uuid"
)

type Contact struct {
	Name    string
	Email   string
	Subject string
	Message string
}

type Config struct {
	FusionClientID        string
	FusionClientSecret    string
	FusionRedirectURI     string
	FusionApplicationID   string
	FusionAPIKey          string
	ThawaniAPIKey         string
	ThawaniBaseUrl        string
	ThawaniPublishableKey string
	BaseUrl               string
}

type PurchaseProductReq struct {
	ProductID  uuid.UUID `json:"product_id"`
	Quantity   int       `json:"quantity"`
	ChosenDate time.Time `json:"chosen_date"`
	Cash       bool      `json:"cash"`
}
