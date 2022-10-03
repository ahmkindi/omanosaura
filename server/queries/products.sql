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
