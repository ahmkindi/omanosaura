-- name: UpsertProduct :exec
INSERT INTO products(
  id,
  kind,
  title,
  title_ar,
  subtitle,
  subtitle_ar,
  description,
  description_ar,
  photo,
  price_baisa,
  planned_dates,
  photos,
  last_updated)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
ON CONFLICT (id) DO UPDATE SET
  title = excluded.title,
  title_ar = excluded.title_ar,
  subtitle = excluded.subtitle,
  subtitle_ar = excluded.subtitle_ar,
  description = excluded.description,
  description_ar = excluded.description_ar,
  photo = excluded.photo,
  price_baisa = excluded.price_baisa,
  planned_dates=excluded.planned_dates,
  photos = excluded.photos,
  last_updated = excluded.last_updated;

-- name: RateProduct :exec
INSERT INTO ratings(product_id, user_id, rating, created_at)
VALUES ($1, $2, $3, CURRENT_DATE) ON CONFLICT (product_id, user_id) DO
UPDATE SET rating = excluded.rating, created_at = excluded.created_at;

-- name: ReviewProduct :exec
INSERT INTO reviews(product_id, user_id, review, last_updated)
VALUES ($1, $2, $3, CURRENT_DATE) ON CONFLICT (product_id, user_id)
DO UPDATE SET
  review = excluded.review,
  last_updated = excluded.last_updated;

-- name: DeleteProductReview :exec
DELETE FROM reviews WHERE product_id = $1 AND user_id = $2;

-- name: DeleteProduct :exec
DELETE FROM products WHERE id = $1;

-- name: UserCanRateProduct :one
SELECT EXISTS (
  SELECT 1 FROM purchases WHERE user_id = $1 AND product_id = $2 AND chosen_date > CURRENT_DATE
);

-- name: InsertPurchase :exec
INSERT INTO purchases(id, product_id, user_id, num_of_participants, paid, cost_baisa, chosen_date, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE);

-- name: GetAllProducts :many
SELECT *
FROM products
INNER JOIN (SELECT SUM(ratings)/COUNT(*) as rating, product_id FROM ratings GROUP BY product_id) l ON products.id = l.product_id;

-- name: GetProduct :one
SELECT *,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1) purchases,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1 AND p.user_id=$2) user_purchases,
(SELECT SUM(ratings)/COUNT(*) as rating FROM ratings r WHERE r.product_id=$1) rating,
(SELECT COUNT(*) as rating_count FROM ratings r WHERE r.product_id=$1) rating_count,
(SELECT rating FROM ratings r WHERE r.product_id = $1 AND r.user_id=$2) rating
FROM products;

-- name: GetProductReviews :many
SELECT r.*, rating FROM products
INNER JOIN (SELECT * FROM reviews WHERE reviews.product_id = $1 AND reviews.user_id = $2) r ON id = r.product_id
INNER JOIN ratings ON r.user_id = ratings.user_id AND r.product_id = ratings.product_id
ORDER BY last_updated
LIMIT $3
OFFSET $4;

-- name: GetBasicProduct :one
SELECT * FROM products WHERE id = $1;
