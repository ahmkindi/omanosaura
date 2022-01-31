package store

import (
	"context"
	"omanosaura/models"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

type eventsStore struct {
	db *sqlx.DB
}

type EventsStore interface {
	InsertOrUpdateEvent(ctx context.Context, event models.Event) error
	GetCurrentEvents(ctx context.Context) ([]models.Event, error)
	GetAllEvents(ctx context.Context) ([]models.Event, error)
	DeleteEvent(ctx context.Context, eventId uuid.UUID) error
}

func NewEventsStore(db *sqlx.DB) EventsStore {
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	return &eventsStore{db: db}
}

func (s *eventsStore) InsertOrUpdateEvent(ctx context.Context, event models.Event) error {
	_, err := s.db.NamedExecContext(ctx,
		`INSERT INTO events VALUES
		(:id, :photo, :expiry)
		ON CONFLICT (id) DO UPDATE SET
			expiry=excluded.expiry,
			photo=excluded.photo`, event)
	return err
}

func (s *eventsStore) GetAllEvents(ctx context.Context) ([]models.Event, error) {
	var events []models.Event
	err := s.db.SelectContext(ctx, &events, `SELECT * FROM events`)
	return events, err
}

func (s *eventsStore) GetCurrentEvents(ctx context.Context) ([]models.Event, error) {
	var events []models.Event
	err := s.db.SelectContext(ctx, &events, `SELECT * FROM events WHERE expiry > CURRENT_DATE`)
	return events, err
}

func (s *eventsStore) DeleteEvent(ctx context.Context, eventId uuid.UUID) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM events WHERE id=$1`, eventId)
	return err
}
