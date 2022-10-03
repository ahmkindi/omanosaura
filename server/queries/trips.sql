-- name: UpsertTrip :exec
WITH upsert_product AS (
  INSERT INTO products(id, kind, title, title_ar, description, description_ar, photo, price_omr)
  VALUES ($1, 'T', $2, $3, $4, $5, $6, $7)
  ON CONFLICT (id) DO UPDATE SET
    title = excluded.title,
    title_ar = excluded.title_ar,
    description = excluded.description,
    description_ar = excluded.description_ar,
    photo = excluded.photo,
    price_omr = excluded.price_omr
)
INSERT INTO trips(id, subtitle, subtitle_ar, photos)
VALUES ($1, $8, $9, $10)
ON CONFLICT (id) DO UPDATE SET
	subtitle = excluded.subtitle,
	subtitle_ar = excluded.subtitle_ar,
  photos = excluded.photos;

-- name: GetAllTrips :many
SELECT * FROM products NATURAL JOIN trips;

-- name: GetTrip :one
SELECT *, (SELECT SUM(rating)/COUNT(*) FROM ratings WHERE ratings.product_id = $1) likes FROM products NATURAL JOIN (SELECT * FROM trips WHERE trips.id = $1) t
INNER JOIN (SELECT * FROM reviews WHERE product_id = $1) r ON t.id = product_id
INNER JOIN users ON r.user_id = users.id;
