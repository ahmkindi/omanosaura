package api

import (
	"database/sql"
	"fmt"
	"omanosaura/database"
	"omanosaura/thawani"
	"omanosaura/thawani/types/mode"

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

	// get User and delete
	return server.Queries.DeleteProductReview(c.Context(), database.DeleteProductReviewParams{
		ProductID: productID,
		UserID:    uuid.Nil,
	})
}

func (server *Server) HandlerPurchaseProduct(c *fiber.Ctx) error {
	req := new(PurchaseProductReq)
	if err := c.BodyParser(req); err != nil {
		return fiber.ErrBadRequest
	}

	validDate, err := server.Queries.ValidateChosenDate(c.Context(), database.ValidateChosenDateParams{
		ProductID:  req.ProductID,
		ChosenDate: req.ChosenDate,
	})
	if err != nil || !validDate {
		return fiber.ErrUnauthorized
	}

	product, err := server.Queries.GetProduct(c.Context(), req.ProductID)
	if err != nil {
		return err
	}

	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrInternalServerError
	}

	// 25% off for trips if 4 or more people are attending
	if product.Kind == "t" && req.Quantity >= 4 {
		product.PriceBaisa /= 4
	}

	purchase := database.InsertPurchaseParams{
		ID:                uuid.New(),
		ProductID:         product.ID,
		UserID:            user.ID,
		NumOfParticipants: int32(req.Quantity),
		Paid:              false,
		ChosenDate:        req.ChosenDate,
		CostBaisa:         int32(req.Quantity) * product.PriceBaisa,
	}
	if req.Cash {
		return server.Queries.InsertPurchase(c.Context(), purchase)
	}

	customerId, err := server.Queries.GetUserCustomerId(c.Context(), user.ID)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	if err != sql.ErrNoRows {
		customer, err := server.ThawaniClient.CreateCustomer(thawani.CreateCustomerReq{
			ClientCustomerId: user.ID.String(),
		})
		if err != nil {
			return err
		}
		customerId = customer.Data.Id
	}

	referenceId := uuid.NewString()

	newSessionReq := thawani.CreateSessionReq{
		ClientReferenceId: referenceId,
		Mode:              mode.Payment,
		Products: []thawani.Product{{
			Name:       product.Title,
			Quantity:   req.Quantity,
			UnitAmount: int(product.PriceBaisa),
		}},
		SuccessUrl: fmt.Sprintf("http://localhost:8081/user/purchase/success/%s", referenceId),
		CancelUrl:  fmt.Sprintf("http://localhost:3000/trips/%s", product.ID),
		CustomerId: customerId,
		Metadata:   purchase,
	}

	_, redirectTo, err := server.ThawaniClient.CreateSession(newSessionReq)
	if err != nil {
		return err
	}

	return c.Redirect(redirectTo)
}

func (server *Server) HandlerPurchaseSuccess(c *fiber.Ctx) error {
	// Get session by client reference
	// store the details from the meta into the DB (update paid to true)
	return nil
}
