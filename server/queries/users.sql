-- name: UpsertUser :exec
INSERT INTO users(id, email, firstname, lastname, phone)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO UPDATE SET
	email = excluded.email,
	firstname = excluded.firstname,
  lastname = excluded.lastname,
  phone = excluded.phone;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserCustomerId :one
SELECT customer_id FROM user_customer_id WHERE user_id = $1;
