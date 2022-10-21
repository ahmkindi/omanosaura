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

func (q *Queries) DeleteProduct(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteProduct, id)
	return err
}

const deleteProductReview = `-- name: DeleteProductReview :exec
DELETE FROM reviews WHERE product_id = $1 AND user_id = $2
`

type DeleteProductReviewParams struct {
	ProductID string    `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
}

func (q *Queries) DeleteProductReview(ctx context.Context, arg DeleteProductReviewParams) error {
	_, err := q.db.Exec(ctx, deleteProductReview, arg.ProductID, arg.UserID)
	return err
}

const getAllProducts = `-- name: GetAllProducts :many
SELECT products.id, products.kind, products.title, products.title_ar, products.subtitle, products.subtitle_ar, products.description, products.description_ar, products.photo, products.price_baisa, products.planned_dates, products.photos, products.longitude, products.latitude, products.last_updated, COALESCE(rating.rating, 0), COALESCE(rating.rating_count, 0)
FROM products
LEFT JOIN (SELECT SUM(rating)/COUNT(*) as rating, product_id, COUNT(*) AS rating_count FROM ratings GROUP BY product_id) rating ON products.id = rating.product_id
`

type GetAllProductsRow struct {
	ID            string      `json:"id"`
	Kind          string      `json:"kind"`
	Title         string      `json:"title"`
	TitleAr       string      `json:"title_ar"`
	Subtitle      string      `json:"subtitle"`
	SubtitleAr    string      `json:"subtitle_ar"`
	Description   string      `json:"description"`
	DescriptionAr string      `json:"description_ar"`
	Photo         string      `json:"photo"`
	PriceBaisa    int32       `json:"price_baisa"`
	PlannedDates  []time.Time `json:"planned_dates"`
	Photos        []string    `json:"photos"`
	Longitude     float64     `json:"longitude"`
	Latitude      float64     `json:"latitude"`
	LastUpdated   time.Time   `json:"last_updated"`
	Rating        int32       `json:"rating"`
	RatingCount   int64       `json:"rating_count"`
}

func (q *Queries) GetAllProducts(ctx context.Context) ([]GetAllProductsRow, error) {
	rows, err := q.db.Query(ctx, getAllProducts)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetAllProductsRow{}
	for rows.Next() {
		var i GetAllProductsRow
		if err := rows.Scan(
			&i.ID,
			&i.Kind,
			&i.Title,
			&i.TitleAr,
			&i.Subtitle,
			&i.SubtitleAr,
			&i.Description,
			&i.DescriptionAr,
			&i.Photo,
			&i.PriceBaisa,
			&i.PlannedDates,
			&i.Photos,
			&i.Longitude,
			&i.Latitude,
			&i.LastUpdated,
			&i.Rating,
			&i.RatingCount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getBasicProduct = `-- name: GetBasicProduct :one
SELECT id, kind, title, title_ar, subtitle, subtitle_ar, description, description_ar, photo, price_baisa, planned_dates, photos, longitude, latitude, last_updated FROM products WHERE id = $1
`

func (q *Queries) GetBasicProduct(ctx context.Context, id string) (Product, error) {
	row := q.db.QueryRow(ctx, getBasicProduct, id)
	var i Product
	err := row.Scan(
		&i.ID,
		&i.Kind,
		&i.Title,
		&i.TitleAr,
		&i.Subtitle,
		&i.SubtitleAr,
		&i.Description,
		&i.DescriptionAr,
		&i.Photo,
		&i.PriceBaisa,
		&i.PlannedDates,
		&i.Photos,
		&i.Longitude,
		&i.Latitude,
		&i.LastUpdated,
	)
	return i, err
}

const getProduct = `-- name: GetProduct :one
SELECT id, kind, title, title_ar, subtitle, subtitle_ar, description, description_ar, photo, price_baisa, planned_dates, photos, longitude, latitude, last_updated,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1) purchases,
(SELECT COUNT(*) FROM purchases p WHERE p.product_id=$1 AND p.user_id=$2) user_purchases,
(SELECT SUM(ratings)/COUNT(*) as rating FROM ratings r WHERE r.product_id=$1) rating,
(SELECT COUNT(*) as rating_count FROM ratings r WHERE r.product_id=$1) rating_count,
(SELECT rating FROM ratings r WHERE r.product_id = $1 AND r.user_id=$2) rating
FROM products
`

type GetProductParams struct {
	ProductID string    `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
}

type GetProductRow struct {
	ID            string      `json:"id"`
	Kind          string      `json:"kind"`
	Title         string      `json:"title"`
	TitleAr       string      `json:"title_ar"`
	Subtitle      string      `json:"subtitle"`
	SubtitleAr    string      `json:"subtitle_ar"`
	Description   string      `json:"description"`
	DescriptionAr string      `json:"description_ar"`
	Photo         string      `json:"photo"`
	PriceBaisa    int32       `json:"price_baisa"`
	PlannedDates  []time.Time `json:"planned_dates"`
	Photos        []string    `json:"photos"`
	Longitude     float64     `json:"longitude"`
	Latitude      float64     `json:"latitude"`
	LastUpdated   time.Time   `json:"last_updated"`
	Purchases     int64       `json:"purchases"`
	UserPurchases int64       `json:"user_purchases"`
	Rating        int32       `json:"rating"`
	RatingCount   int64       `json:"rating_count"`
	Rating_2      float64     `json:"rating_2"`
}

func (q *Queries) GetProduct(ctx context.Context, arg GetProductParams) (GetProductRow, error) {
	row := q.db.QueryRow(ctx, getProduct, arg.ProductID, arg.UserID)
	var i GetProductRow
	err := row.Scan(
		&i.ID,
		&i.Kind,
		&i.Title,
		&i.TitleAr,
		&i.Subtitle,
		&i.SubtitleAr,
		&i.Description,
		&i.DescriptionAr,
		&i.Photo,
		&i.PriceBaisa,
		&i.PlannedDates,
		&i.Photos,
		&i.Longitude,
		&i.Latitude,
		&i.LastUpdated,
		&i.Purchases,
		&i.UserPurchases,
		&i.Rating,
		&i.RatingCount,
		&i.Rating_2,
	)
	return i, err
}

const getProductReviews = `-- name: GetProductReviews :many
SELECT r.product_id, r.user_id, r.review, r.last_updated, rating FROM products
INNER JOIN (SELECT product_id, user_id, review, last_updated FROM reviews WHERE reviews.product_id = $1 AND reviews.user_id = $2) r ON id = r.product_id
INNER JOIN ratings ON r.user_id = ratings.user_id AND r.product_id = ratings.product_id
ORDER BY last_updated
LIMIT $3
OFFSET $4
`

type GetProductReviewsParams struct {
	ProductID string    `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Limit     int32     `json:"limit"`
	Offset    int32     `json:"offset"`
}

type GetProductReviewsRow struct {
	ProductID   string    `json:"product_id"`
	UserID      uuid.UUID `json:"user_id"`
	Review      string    `json:"review"`
	LastUpdated time.Time `json:"last_updated"`
	Rating      float64   `json:"rating"`
}

func (q *Queries) GetProductReviews(ctx context.Context, arg GetProductReviewsParams) ([]GetProductReviewsRow, error) {
	rows, err := q.db.Query(ctx, getProductReviews,
		arg.ProductID,
		arg.UserID,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetProductReviewsRow{}
	for rows.Next() {
		var i GetProductReviewsRow
		if err := rows.Scan(
			&i.ProductID,
			&i.UserID,
			&i.Review,
			&i.LastUpdated,
			&i.Rating,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertPurchase = `-- name: InsertPurchase :exec
INSERT INTO purchases(id, product_id, user_id, num_of_participants, paid, cost_baisa, chosen_date, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
`

type InsertPurchaseParams struct {
	ID                uuid.UUID `json:"id"`
	ProductID         string    `json:"product_id"`
	UserID            uuid.UUID `json:"user_id"`
	NumOfParticipants int32     `json:"num_of_participants"`
	Paid              bool      `json:"paid"`
	CostBaisa         int32     `json:"cost_baisa"`
	ChosenDate        time.Time `json:"chosen_date"`
}

func (q *Queries) InsertPurchase(ctx context.Context, arg InsertPurchaseParams) error {
	_, err := q.db.Exec(ctx, insertPurchase,
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
	ProductID string    `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Rating    float64   `json:"rating"`
}

func (q *Queries) RateProduct(ctx context.Context, arg RateProductParams) error {
	_, err := q.db.Exec(ctx, rateProduct, arg.ProductID, arg.UserID, arg.Rating)
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
	ProductID string    `json:"product_id"`
	UserID    uuid.UUID `json:"user_id"`
	Review    string    `json:"review"`
}

func (q *Queries) ReviewProduct(ctx context.Context, arg ReviewProductParams) error {
	_, err := q.db.Exec(ctx, reviewProduct, arg.ProductID, arg.UserID, arg.Review)
	return err
}

const upsertProduct = `-- name: UpsertProduct :exec
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
  last_updated = CURRENT_DATE
`

type UpsertProductParams struct {
	ID            string      `json:"id"`
	Kind          string      `json:"kind"`
	Title         string      `json:"title"`
	TitleAr       string      `json:"title_ar"`
	Subtitle      string      `json:"subtitle"`
	SubtitleAr    string      `json:"subtitle_ar"`
	Description   string      `json:"description"`
	DescriptionAr string      `json:"description_ar"`
	Photo         string      `json:"photo"`
	PriceBaisa    int32       `json:"price_baisa"`
	PlannedDates  []time.Time `json:"planned_dates"`
	Photos        []string    `json:"photos"`
	Longitude     float64     `json:"longitude"`
	Latitude      float64     `json:"latitude"`
}

func (q *Queries) UpsertProduct(ctx context.Context, arg UpsertProductParams) error {
	_, err := q.db.Exec(ctx, upsertProduct,
		arg.ID,
		arg.Kind,
		arg.Title,
		arg.TitleAr,
		arg.Subtitle,
		arg.SubtitleAr,
		arg.Description,
		arg.DescriptionAr,
		arg.Photo,
		arg.PriceBaisa,
		arg.PlannedDates,
		arg.Photos,
		arg.Longitude,
		arg.Latitude,
	)
	return err
}

const userCanRateProduct = `-- name: UserCanRateProduct :one
SELECT EXISTS (
  SELECT 1 FROM purchases WHERE user_id = $1 AND product_id = $2 AND chosen_date > CURRENT_DATE
)
`

type UserCanRateProductParams struct {
	UserID    uuid.UUID `json:"user_id"`
	ProductID string    `json:"product_id"`
}

func (q *Queries) UserCanRateProduct(ctx context.Context, arg UserCanRateProductParams) (bool, error) {
	row := q.db.QueryRow(ctx, userCanRateProduct, arg.UserID, arg.ProductID)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}
