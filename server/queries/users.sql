-- name: InsertUser :exec
INSERT INTO users(id, email, name, phone, role)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING;

-- name: UpdateUser :exec
UPDATE users SET name = $1, phone = $2;

-- name: UpdateUserRole :exec
UPDATE users SET role = $1;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserCustomerId :one
SELECT customer_id FROM user_customer_id WHERE user_id = $1;
