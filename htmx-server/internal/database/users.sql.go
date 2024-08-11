// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: users.sql

package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getAllUsers = `-- name: GetAllUsers :many
select users.id, users.email, users.name, users.phone, users.role, COALESCE(avg_rating, -1) as avg_rating, COALESCE(last_trip, '01/01/0001') as last_trip, COALESCE(purchase_count, 0) as purchase_count
from users left join (select user_id, AVG(rating)::float as avg_rating from reviews group by user_id) r on users.id = r.user_id
left join (select user_id, MAX(chosen_date)::date as last_trip, COUNT(id) as purchase_count from purchases where complete = true group by user_id) p on users.id = p.user_id
order by id
`

type GetAllUsersRow struct {
	ID            string      `json:"id"`
	Email         string      `json:"email"`
	Name          string      `json:"name"`
	Phone         string      `json:"phone"`
	Role          UserRole    `json:"role"`
	AvgRating     float64     `json:"avg_rating"`
	LastTrip      pgtype.Date `json:"last_trip"`
	PurchaseCount int64       `json:"purchase_count"`
}

func (q *Queries) GetAllUsers(ctx context.Context) ([]GetAllUsersRow, error) {
	rows, err := q.db.Query(ctx, getAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetAllUsersRow{}
	for rows.Next() {
		var i GetAllUsersRow
		if err := rows.Scan(
			&i.ID,
			&i.Email,
			&i.Name,
			&i.Phone,
			&i.Role,
			&i.AvgRating,
			&i.LastTrip,
			&i.PurchaseCount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUser = `-- name: GetUser :one
SELECT id, email, name, phone, role FROM users WHERE id = $1
`

func (q *Queries) GetUser(ctx context.Context, id string) (User, error) {
	row := q.db.QueryRow(ctx, getUser, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Name,
		&i.Phone,
		&i.Role,
	)
	return i, err
}

const getUserCustomerId = `-- name: GetUserCustomerId :one
SELECT customer_id FROM user_customer_id WHERE user_id = $1
`

func (q *Queries) GetUserCustomerId(ctx context.Context, userID string) (string, error) {
	row := q.db.QueryRow(ctx, getUserCustomerId, userID)
	var customer_id string
	err := row.Scan(&customer_id)
	return customer_id, err
}

const insertUser = `-- name: InsertUser :exec
INSERT INTO users(id, email, name, phone, role)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING
`

type InsertUserParams struct {
	ID    string   `json:"id"`
	Email string   `json:"email"`
	Name  string   `json:"name"`
	Phone string   `json:"phone"`
	Role  UserRole `json:"role"`
}

func (q *Queries) InsertUser(ctx context.Context, arg InsertUserParams) error {
	_, err := q.db.Exec(ctx, insertUser,
		arg.ID,
		arg.Email,
		arg.Name,
		arg.Phone,
		arg.Role,
	)
	return err
}

const updateUser = `-- name: UpdateUser :exec
UPDATE users SET name = $1, phone = $2 where id = $3
`

type UpdateUserParams struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	ID    string `json:"id"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) error {
	_, err := q.db.Exec(ctx, updateUser, arg.Name, arg.Phone, arg.ID)
	return err
}

const updateUserRole = `-- name: UpdateUserRole :exec
UPDATE users SET role = $1 WHERE id = $2
`

type UpdateUserRoleParams struct {
	Role UserRole `json:"role"`
	ID   string   `json:"id"`
}

func (q *Queries) UpdateUserRole(ctx context.Context, arg UpdateUserRoleParams) error {
	_, err := q.db.Exec(ctx, updateUserRole, arg.Role, arg.ID)
	return err
}