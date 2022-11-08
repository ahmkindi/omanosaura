// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.14.0
// source: users.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const getUser = `-- name: GetUser :one
SELECT id, email, firstname, lastname, phone, roles FROM users WHERE id = $1
`

func (q *Queries) GetUser(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, getUser, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Firstname,
		&i.Lastname,
		&i.Phone,
		&i.Roles,
	)
	return i, err
}

const getUserCustomerId = `-- name: GetUserCustomerId :one
SELECT customer_id FROM user_customer_id WHERE user_id = $1
`

func (q *Queries) GetUserCustomerId(ctx context.Context, userID uuid.UUID) (string, error) {
	row := q.db.QueryRow(ctx, getUserCustomerId, userID)
	var customer_id string
	err := row.Scan(&customer_id)
	return customer_id, err
}

const upsertUser = `-- name: UpsertUser :exec
INSERT INTO users(id, email, firstname, lastname, phone, roles)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (id) DO UPDATE SET
	email = excluded.email,
	firstname = excluded.firstname,
  lastname = excluded.lastname,
  phone = excluded.phone,
  roles = excluded.roles
`

type UpsertUserParams struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Firstname string    `json:"firstname"`
	Lastname  string    `json:"lastname"`
	Phone     string    `json:"phone"`
	Roles     []string  `json:"roles"`
}

func (q *Queries) UpsertUser(ctx context.Context, arg UpsertUserParams) error {
	_, err := q.db.Exec(ctx, upsertUser,
		arg.ID,
		arg.Email,
		arg.Firstname,
		arg.Lastname,
		arg.Phone,
		arg.Roles,
	)
	return err
}
