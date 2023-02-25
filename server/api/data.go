package api

import (
	"time"
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
	FusionApplicationID   string
	FusionAPIKey          string
	ThawaniAPIKey         string
	ThawaniBaseUrl        string
	ThawaniPublishableKey string
	BaseUrl               string
}

type PurchaseProductReq struct {
	ProductID  string    `json:"product_id"`
	Quantity   int64     `json:"quantity"`
	ChosenDate time.Time `json:"chosen_date"`
	Cash       bool      `json:"cash"`
	PayExtra   bool      `json:"pay_extra"`
}
