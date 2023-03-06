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

-- name: GetAllUsers :many
select users.*, COALESCE(avg_rating, -1) as avg_rating, COALESCE(last_trip, '01/01/0001') as last_trip, COALESCE(purchase_count, 0) as purchase_count
from users left join (select user_id, AVG(rating)::float as avg_rating from reviews group by user_id) r on users.id = r.user_id
left join (select user_id, MAX(chosen_date)::date as last_trip, COUNT(id) as purchase_count from purchases where complete = true group by user_id) p on users.id = p.user_id;
