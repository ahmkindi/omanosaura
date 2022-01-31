package models

import (
	"time"

	"github.com/google/uuid"
)

type Trip struct {
	Id            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	TitleAr       string    `json:"title_ar"`
	Subtitle      string    `json:"subtitle"`
	SubtitleAr    string    `json:"subtitle_ar"`
	Description   string    `json:"description"`
	DescriptionAr string    `json:"description_ar"`
	FrontPhoto    []byte    `json:"front_photo"`
}

type TripPhoto struct {
	Id     uuid.UUID `json:"id"`
	TripId uuid.UUID `json:"trip_id"`
	Photo  []byte    `json:"photo"`
}

type Adventure struct {
	Id            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	TitleAr       string    `json:"title_ar"`
	Description   string    `json:"description"`
	DescriptionAr string    `json:"description_ar"`
	Photo         []byte    `json:"photo"`
}

type Event struct {
	Id     uuid.UUID `json:"id"`
	Photo  []byte    `json:"photo"`
	Expiry time.Time `json:"expiry"`
}

type User struct {
	Id    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Phone string    `json:"phone"`
}

type EventUser struct {
	EventId uuid.UUID `json:"event_id"`
	UserId  uuid.UUID `json:"user_id"`
}
