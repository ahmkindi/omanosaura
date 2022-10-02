-- name: LikeProduct :exec
INSERT INTO likes(product_id, user_id, created_at)
VALUES ($1, $2, CURRENT_DATE) ON CONFLICT (product_id, user_id) DO NOTHING;

-- name: DislikeProduct :exec
DELETE FROM likes WHERE product_id = $1 AND user_id = $2;

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
