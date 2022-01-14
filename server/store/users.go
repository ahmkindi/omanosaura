package store

import (
	"context"
	"omanosaura/models"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

type usersStore struct {
	db *sqlx.DB
}

type UsersStore interface {
	InsertOrUpdateUser(ctx context.Context, user models.User) (*models.User, error)
	InsertEventUser(ctx context.Context, eventUser models.EventUser) error
	GetAllUsers(ctx context.Context) ([]models.User, error)
	GetAllUsersForEvent(ctx context.Context, eventId uuid.UUID) ([]models.User, error)
}

func NewUsersStore(db *sqlx.DB) UsersStore {
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)
	return &usersStore{db: db}
}

func (s *usersStore) InsertOrUpdateUser(
	ctx context.Context,
	user models.User,
) (*models.User, error) {
	_, err := s.db.NamedExecContext(ctx,
		`INSERT INTO users VALUES
    (:id, :email, :name, :phone)
		ON CONFLICT (email) DO UPDATE SET
			name=excluded.name,
			phone=excluded.phone`, user)
	if err != nil {
		return nil, err
	}
	var insertedOrUpdatedUser models.User
	err = s.db.GetContext(
		ctx,
		&insertedOrUpdatedUser,
		`SELECT * FROM users WHERE email=$1`,
		user.Email,
	)
	return &insertedOrUpdatedUser, err
}

func (s *usersStore) InsertEventUser(ctx context.Context, eventUser models.EventUser) error {
	_, err := s.db.NamedExecContext(ctx,
		`INSERT INTO event_users VALUES
    (:event_id, :user_id)
		ON CONFLICT (event_id, user_id DO NOTHING`, eventUser)
	return err
}

func (s *usersStore) GetAllUsers(ctx context.Context) ([]models.User, error) {
	var users []models.User
	err := s.db.SelectContext(ctx, &users, `SELECT * FROM users`)
	return users, err
}

func (s *usersStore) GetAllUsersForEvent(
	ctx context.Context,
	eventId uuid.UUID,
) ([]models.User, error) {
	var users []models.User
	err := s.db.SelectContext(
		ctx,
		&users,
		`SELECT * FROM users INNER JOIN (SELECT * FROM events WHERE event_id=$1) e ON users.id=e.user_id`,
		eventId,
	)
	return users, err
}
