// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.14.0
// source: products.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const deleteProduct = `-- name: DeleteProduct :exec
DELETE FROM products WHERE id = $1
`

func (q *Queries) DeleteProduct(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteProduct, id)
	return err
}

const deleteProductReview = `-- name: DeleteProductReview :exec
DELETE FROM reviews WHERE product_id = $1 AND user_id = $2
`

type DeleteProductReviewParams struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
}

func (q *Queries) DeleteProductReview(ctx context.Context, arg DeleteProductReviewParams) error {
	_, err := q.db.ExecContext(ctx, deleteProductReview, arg.ProductID, arg.UserID)
	return err
}

const getProduct = `-- name: GetProduct :one
SELECT id, kind, title, title_ar, description, description_ar, photo, price_baisa, last_udpated FROM products WHERE id = $1
`

func (q *Queries) GetProduct(ctx context.Context, id uuid.UUID) (Product, error) {
	row := q.db.QueryRowContext(ctx, getProduct, id)
	var i Product
	err := row.Scan(
		&i.ID,
		&i.Kind,
		&i.Title,
		&i.TitleAr,
		&i.Description,
		&i.DescriptionAr,
		&i.Photo,
		&i.PriceBaisa,
		&i.LastUdpated,
	)
	return i, err
}

const insertPurchase = `-- name: InsertPurchase :exec
INSERT INTO purchases(id, product_id, user_id, num_of_participants, paid, cost_baisa, chosen_date, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
`

type InsertPurchaseParams struct {
	ID                uuid.UUID `json:"id"`
	ProductID         uuid.UUID `json:"product_id"`
	UserID            uuid.UUID `json:"user_id"`
	NumOfParticipants int32     `json:"num_of_participants"`
	Paid              bool      `json:"paid"`
	CostBaisa         int32     `json:"cost_baisa"`
	ChosenDate        time.Time `json:"chosen_date"`
}

func (q *Queries) InsertPurchase(ctx context.Context, arg InsertPurchaseParams) error {
	_, err := q.db.ExecContext(ctx, insertPurchase,
		arg.ID,
		arg.ProductID,
		arg.UserID,
		arg.NumOfParticipants,
		arg.Paid,
		arg.CostBaisa,
		arg.ChosenDate,
	)
	return err
}

const rateProduct = `-- name: RateProduct :exec
INSERT INTO ratings(product_id, user_id, rating, created_at)
VALUES ($1, $2, $3, CURRENT_DATE) ON CONFLICT (product_id, user_id) DO
UPDATE SET rating = excluded.rating, created_at = excluded.created_at
`

type RateProductParams struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Rating    float64   `json:"rating"`
}

func (q *Queries) RateProduct(ctx context.Context, arg RateProductParams) error {
	_, err := q.db.ExecContext(ctx, rateProduct, arg.ProductID, arg.UserID, arg.Rating)
	return err
}

const reviewProduct = `-- name: ReviewProduct :exec
INSERT INTO reviews(product_id, user_id, review, last_updated)
VALUES ($1, $2, $3, CURRENT_DATE) ON CONFLICT (product_id, user_id)
DO UPDATE SET
  review = excluded.review,
  last_updated = excluded.last_updated
`

type ReviewProductParams struct {
	ProductID uuid.UUID `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Review    string    `json:"review"`
}

func (q *Queries) ReviewProduct(ctx context.Context, arg ReviewProductParams) error {
	_, err := q.db.ExecContext(ctx, reviewProduct, arg.ProductID, arg.UserID, arg.Review)
	return err
}

const userCanRateProduct = `-- name: UserCanRateProduct :one
SELECT EXISTS (
  SELECT 1 FROM purchases WHERE user_id = $1 AND product_id = $2 AND chosen_date > CURRENT_DATE
)
`

type UserCanRateProductParams struct {
	UserID    uuid.UUID `json:"user_id"`
	ProductID uuid.UUID `json:"product_id"`
}

func (q *Queries) UserCanRateProduct(ctx context.Context, arg UserCanRateProductParams) (bool, error) {
	row := q.db.QueryRowContext(ctx, userCanRateProduct, arg.UserID, arg.ProductID)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const validateChosenDate = `-- name: ValidateChosenDate :one
SELECT EXISTS (
  (SELECT 1 FROM adventures a WHERE a.id = $1 AND $2::DATE = ANY(available_dates))
  UNION
  (SELECT 1 FROM trips t WHERE t.id = $1 AND $2 > CURRENT_DATE + 1)
)
`

type ValidateChosenDateParams struct {
	ProductID  uuid.UUID `json:"product_id"`
	ChosenDate time.Time `json:"chosen_date"`
}

func (q *Queries) ValidateChosenDate(ctx context.Context, arg ValidateChosenDateParams) (bool, error) {
	row := q.db.QueryRowContext(ctx, validateChosenDate, arg.ProductID, arg.ChosenDate)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}
