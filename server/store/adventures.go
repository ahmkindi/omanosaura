package store

import (
	"context"
	"omanosaura/models"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

type adventuresStore struct {
	db *sqlx.DB
}

type AdventuresStore interface {
	InsertOrUpdateAdventure(ctx context.Context, adventure models.Adventure) error
	GetAllAdventures(ctx context.Context) ([]models.Adventure, error)
	DeleteAdventure(ctx context.Context, advId uuid.UUID) error
}

func NewAdventuresStore(db *sqlx.DB) AdventuresStore {
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	return &adventuresStore{db: db}
}

func (s *adventuresStore) InsertOrUpdateAdventure(ctx context.Context, adventure models.Adventure) error {
	_, err := s.db.NamedExecContext(ctx,
		`INSERT INTO adventures VALUES
		(:id, :title, :title_ar, :description, :description_ar, :photo)
		ON CONFLICT (id) DO UPDATE SET
			title=excluded.title,
			title_ar=excluded.title_ar,
			description=excluded.description,
			description_ar=excluded.description_ar,
			photo=excluded.photo`, adventure)
	return err
}

func (s *adventuresStore) GetAllAdventures(ctx context.Context) ([]models.Adventure, error) {
	var adventures []models.Adventure
	err := s.db.SelectContext(ctx, &adventures, `SELECT * FROM adventures`)
	return adventures, err
}

func (s *adventuresStore) DeleteAdventure(ctx context.Context, advId uuid.UUID) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM adventures WHERE id=$1`, advId)
	return err
}
