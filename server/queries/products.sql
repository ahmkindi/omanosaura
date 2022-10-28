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
  longitude,
  latitude,
  last_updated)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_DATE)
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
  longitude = excluded.longitude,
  latitute = excluded.latitute,
  last_updated = CURRENT_DATE;

-- name: ReviewProduct :exec
INSERT INTO reviews(product_id, user_id, rating, title, review, last_updated)
VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) ON CONFLICT (product_id, user_id)
DO UPDATE SET
  rating = excluded.rating,
  title = excluded.title,
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
SELECT products.*, r.rating, r.rating_count, review.review_count
FROM products
LEFT JOIN (SELECT  COALESCE(SUM(rating)/COUNT(*), 0) as rating, product_id, COALESCE(COUNT(*), 0)  AS rating_count FROM reviews GROUP BY product_id) r ON products.id = r.product_id
LEFT JOIN (SELECT  COALESCE(COUNT(*), 0) as review_count, product_id FROM reviews WHERE title != '' GROUP BY product_id) review ON products.id = review.product_id;

-- name: GetProduct :one
SELECT *,
(SELECT COALESCE(COUNT(*), 0) FROM purchases p WHERE p.product_id=$1) purchases_count,
(SELECT COALESCE(SUM(rating)/COUNT(*), 0) as rating FROM reviews r WHERE r.product_id=$1) rating,
(SELECT COALESCE(COUNT(*), 0) as rating_count FROM reviews r WHERE r.product_id=$1) rating_count,
(SELECT COALESCE(COUNT(*), 0) as review_count FROM reviews r WHERE r.product_id = $1 AND title != '') review_count
FROM products;

-- name: GetProductReviews :many
SELECT reviews.*, users.firstname, users.lastname FROM reviews
INNER JOIN users ON reviews.user_id = users.id
WHERE reviews.product_id = $1
ORDER BY last_updated
LIMIT sqlc.arg(page)::int * 10
OFFSET (sqlc.arg(page)::int - 1) * 10;

-- name: GetUserProductReview :one
SELECT rating, review, last_updated FROM reviews WHERE product_id=$1 AND user_id=$2;

-- name: GetBasicProduct :one
SELECT * FROM products WHERE id = $1;
