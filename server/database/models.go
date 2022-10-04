// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.14.0

package database

import (
	"time"

	"github.com/google/uuid"
)

type Adventure struct {
	ID             uuid.UUID   `json:"id"`
	AvailableDates []time.Time `json:"available_dates"`
}

type Product struct {
	ID            uuid.UUID `json:"id"`
	Kind          string    `json:"kind"`
	Title         string    `json:"title"`
	TitleAr       string    `json:"title_ar"`
	Description   string    `json:"description"`
	DescriptionAr string    `json:"description_ar"`
	Photo         string    `json:"photo"`
	PriceBaisa    int32     `json:"price_baisa"`
	LastUdpated   time.Time `json:"last_udpated"`
}

type Purchase struct {
	ID                uuid.UUID `json:"id"`
	ProductID         uuid.UUID `json:"product_id"`
	UserID            uuid.UUID `json:"user_id"`
	NumOfParticipants int32     `json:"num_of_participants"`
	Paid              bool      `json:"paid"`
	CostBaisa         int32     `json:"cost_baisa"`
	ChosenDate        time.Time `json:"chosen_date"`
	CreatedAt         time.Time `json:"created_at"`
}

type Rating struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	Rating    float64   `json:"rating"`
}

type Review struct {
	ProductID   uuid.UUID `json:"product_id"`
	UserID      uuid.UUID `json:"user_id"`
	Review      string    `json:"review"`
	LastUpdated time.Time `json:"last_updated"`
}

type Trip struct {
	ID         uuid.UUID `json:"id"`
	Subtitle   string    `json:"subtitle"`
	SubtitleAr string    `json:"subtitle_ar"`
	Photos     []string  `json:"photos"`
}

type User struct {
	ID        uuid.UUID   `json:"id"`
	Email     interface{} `json:"email"`
	Firstname string      `json:"firstname"`
	Lastname  string      `json:"lastname"`
	Phone     string      `json:"phone"`
}

type UserCustomerID struct {
	UserID     uuid.UUID `json:"user_id"`
	CustomerID string    `json:"customer_id"`
}
