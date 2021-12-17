package store

import (
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

type tripsStore struct {
	db *sqlx.DB
}

type TripsStore interface {
}

func NewTripsStore(db *sqlx.DB) TripsStore {
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	return &tripsStore{db: db}
}
