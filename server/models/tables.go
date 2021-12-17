package models

import "github.com/google/uuid"

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
