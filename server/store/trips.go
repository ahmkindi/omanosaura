package store

import (
	"context"
	"omanosaura/models"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

type tripsStore struct {
	db *sqlx.DB
}

type TripsStore interface {
	InsertOrUpdateTrip(ctx context.Context, trip models.Trip) error
	GetAllTrips(ctx context.Context) ([]models.Trip, error)
	DeleteTrip(ctx context.Context, tripId uuid.UUID) error
	InsertTripPhoto(ctx context.Context, tripPhoto models.TripPhoto) error
	GetTripPhotos(ctx context.Context, tripId uuid.UUID) ([]models.TripPhoto, error)
	DeleteTripPhoto(ctx context.Context, photoId uuid.UUID) error
}

func NewTripsStore(db *sqlx.DB) TripsStore {
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	return &tripsStore{db: db}
}

func (s *tripsStore) InsertOrUpdateTrip(ctx context.Context, trip models.Trip) error {
	_, err := s.db.NamedExecContext(ctx,
		`INSERT INTO trips VALUES
		(:id, :title, :title_ar, :subtitle, :subtitle_ar, :description, :description_ar, :front_photo)
		ON CONFLICT (id) DO UPDATE SET
			title=excluded.title,
			title_ar=excluded.title_ar,
			subtitle=excluded.subtitle,
			subtitle_ar=excluded.subtitle_ar,
			description=excluded.description,
			description_ar=excluded.description_ar,
			front_photo=excluded.front_photo`, trip)
	return err
}

func (s *tripsStore) GetAllTrips(ctx context.Context) ([]models.Trip, error) {
	var trips []models.Trip
	err := s.db.SelectContext(ctx, &trips, `SELECT * FROM trips`)
	return trips, err
}

func (s *tripsStore) DeleteTrip(ctx context.Context, tripId uuid.UUID) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM trips WHERE id=$1`, tripId)
	return err
}

func (s *tripsStore) InsertTripPhoto(ctx context.Context, tripPhoto models.TripPhoto) error {
	_, err := s.db.NamedExecContext(ctx, `INSERT INTO trip_photos VALUES(:id, :trip_id, :photo)`, tripPhoto)
	return err
}

func (s *tripsStore) GetTripPhotos(ctx context.Context, tripId uuid.UUID) ([]models.TripPhoto, error) {
	var tripPhotos []models.TripPhoto
	err := s.db.SelectContext(ctx, &tripPhotos, `SELECT * from trip_photos where trip_id=$1`, tripId)
	return tripPhotos, err
}

func (s *tripsStore) DeleteTripPhoto(ctx context.Context, photoId uuid.UUID) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM trip_photos WHERE id=$1`, photoId)
	return err
}
