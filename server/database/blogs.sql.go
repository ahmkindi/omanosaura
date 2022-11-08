// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.14.0
// source: blogs.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const getBlog = `-- name: GetBlog :one
SELECT blogs.id, title, description, title_ar, description_ar, page, page_ar, user_id, created_at, users.id, email, firstname, lastname, phone, roles
FROM blogs INNER JOIN users ON users.id = blogs.user_id
WHERE blogs.id = $1
`

type GetBlogRow struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	TitleAr       string    `json:"title_ar"`
	DescriptionAr string    `json:"description_ar"`
	Page          string    `json:"page"`
	PageAr        string    `json:"page_ar"`
	UserID        uuid.UUID `json:"user_id"`
	CreatedAt     time.Time `json:"created_at"`
	ID_2          uuid.UUID `json:"id_2"`
	Email         string    `json:"email"`
	Firstname     string    `json:"firstname"`
	Lastname      string    `json:"lastname"`
	Phone         string    `json:"phone"`
	Roles         []string  `json:"roles"`
}

func (q *Queries) GetBlog(ctx context.Context, id string) (GetBlogRow, error) {
	row := q.db.QueryRow(ctx, getBlog, id)
	var i GetBlogRow
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.TitleAr,
		&i.DescriptionAr,
		&i.Page,
		&i.PageAr,
		&i.UserID,
		&i.CreatedAt,
		&i.ID_2,
		&i.Email,
		&i.Firstname,
		&i.Lastname,
		&i.Phone,
		&i.Roles,
	)
	return i, err
}

const getBlogs = `-- name: GetBlogs :many
SELECT blogs.id, blogs.title, blogs.description, blogs.title_ar, blogs.description_ar, blogs.created_at, users.id, users.email, users.firstname, users.lastname, users.phone, users.roles
FROM blogs INNER JOIN users ON users.id = blogs.user_id
ORDER BY created_at
`

type GetBlogsRow struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	TitleAr       string    `json:"title_ar"`
	DescriptionAr string    `json:"description_ar"`
	CreatedAt     time.Time `json:"created_at"`
	ID_2          uuid.UUID `json:"id_2"`
	Email         string    `json:"email"`
	Firstname     string    `json:"firstname"`
	Lastname      string    `json:"lastname"`
	Phone         string    `json:"phone"`
	Roles         []string  `json:"roles"`
}

func (q *Queries) GetBlogs(ctx context.Context) ([]GetBlogsRow, error) {
	rows, err := q.db.Query(ctx, getBlogs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetBlogsRow{}
	for rows.Next() {
		var i GetBlogsRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.TitleAr,
			&i.DescriptionAr,
			&i.CreatedAt,
			&i.ID_2,
			&i.Email,
			&i.Firstname,
			&i.Lastname,
			&i.Phone,
			&i.Roles,
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

const upsertBlog = `-- name: UpsertBlog :exec
INSERT INTO blogs(id, title, description, title_ar, description_ar, page, page_ar, user_id, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE) ON CONFLICT (id)
DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  title_ar = excluded.title_ar,
  description_ar = excluded.description_ar,
  page = excluded.page,
  page_ar = excluded.page_ar,
  created_at = excluded.created_at
`

type UpsertBlogParams struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	TitleAr       string    `json:"title_ar"`
	DescriptionAr string    `json:"description_ar"`
	Page          string    `json:"page"`
	PageAr        string    `json:"page_ar"`
	UserID        uuid.UUID `json:"user_id"`
}

func (q *Queries) UpsertBlog(ctx context.Context, arg UpsertBlogParams) error {
	_, err := q.db.Exec(ctx, upsertBlog,
		arg.ID,
		arg.Title,
		arg.Description,
		arg.TitleAr,
		arg.DescriptionAr,
		arg.Page,
		arg.PageAr,
		arg.UserID,
	)
	return err
}
