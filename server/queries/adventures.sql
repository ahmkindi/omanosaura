-- name: UpsertAdventure :exec
WITH upsert_product AS (
  INSERT INTO products(id, kind, title, title_ar, description, description_ar, photo, price_baisa)
  VALUES ($1, 'A', $2, $3, $4, $5, $6, $7)
  ON CONFLICT (id) DO UPDATE SET
    title = excluded.title,
    title_ar = excluded.title_ar,
    description = excluded.description,
    description_ar = excluded.description_ar,
    photo = excluded.photo,
    price_baisa = excluded.price_baisa
)
INSERT INTO adventures(id, available_dates)
VALUES ($1, $8)
ON CONFLICT (id) DO UPDATE SET
	available_dates=excluded.available_dates;

-- name: GetAllAdventures :many
SELECT *
FROM products NATURAL JOIN adventures
INNER JOIN (SELECT SUM(ratings)/COUNT(*) as rating, product_id FROM ratings GROUP BY product_id) l ON products.id = l.product_id;

-- name: GetAdventure :one
SELECT *,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1) purchases,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1 AND p.user_id=$2) user_purchases,
(SELECT SUM(ratings)/COUNT(*) as rating FROM ratings r WHERE r.product_id=$1) rating,
(SELECT rating FROM ratings r WHERE r.product_id = $1 AND r.user_id=$2) rating
FROM products NATURAL JOIN (SELECT * FROM adventures WHERE adventures.id = $1) a
INNER JOIN (SELECT * FROM reviews WHERE product_id = $1) r ON a.id = product_id
INNER JOIN users ON r.user_id = users.id;
