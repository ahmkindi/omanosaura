-- name: UpsertBlog :exec
INSERT INTO blogs(id, title, description, title_ar, description_ar, photo, page, page_ar, user_id, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE) ON CONFLICT (id)
DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  title_ar = excluded.title_ar,
  description_ar = excluded.description_ar,
  photo = excluded.photo,
  page = excluded.page,
  page_ar = excluded.page_ar,
  created_at = excluded.created_at;

-- name: GetBlogs :many
SELECT blogs.id, blogs.title, blogs.description, blogs.title_ar, blogs.description_ar, blogs.created_at, blogs.photo, blogs.user_id, users.name
FROM blogs INNER JOIN users ON users.id = blogs.user_id
ORDER BY created_at;

-- name: GetBlog :one
SELECT *
FROM blogs INNER JOIN users ON users.id = blogs.user_id
WHERE blogs.id = $1;

-- name: DeleteBlog :exec
DELETE FROM blogs WHERE id = $1;
