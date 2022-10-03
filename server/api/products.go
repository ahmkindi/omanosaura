package api

import (
	"log"
	"omanosaura/database"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (server *Server) HandlerDeleteProduct(c *fiber.Ctx) error {
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.ErrBadRequest
	}

	return server.Queries.DeleteProduct(c.Context(), productID)
}

func (server *Server) HandlerRateProduct(c *fiber.Ctx) error {
	rating := new(database.RateProductParams)
	if err := c.BodyParser(rating); err != nil {
		return fiber.ErrBadRequest
	}

	// Get user ID from session
	rating.UserID = uuid.Nil

	canRate, err := server.Queries.UserCanRateProduct(c.Context(), database.UserCanRateProductParams{
		ProductID: rating.ProductID,
		UserID:    rating.UserID,
	})
	if err != nil {
		return err
	}
	if !canRate {
		return fiber.ErrUnauthorized
	}

	return server.Queries.RateProduct(c.Context(), *rating)
}

func (server *Server) HandlerReviewProduct(c *fiber.Ctx) error {
	review := new(database.ReviewProductParams)
	if err := c.BodyParser(review); err != nil {
		return fiber.ErrBadRequest
	}

	// Get user ID from session
	review.UserID = uuid.Nil

	canRate, err := server.Queries.UserCanRateProduct(c.Context(), database.UserCanRateProductParams{
		ProductID: review.ProductID,
		UserID:    review.UserID,
	})
	if err != nil {
		return err
	}
	if !canRate {
		return fiber.ErrUnauthorized
	}

	return server.Queries.ReviewProduct(c.Context(), *review)

}

func (server *Server) HandlerDeleteReviewProduct(c *fiber.Ctx) error {
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.ErrBadRequest
	}
	log.Print(productID)

	// get User and delete
	return server.Queries.DeleteProductReview(c.Context(), database.DeleteProductReviewParams{
		ProductID: productID,
		UserID:    uuid.Nil,
	})
}
