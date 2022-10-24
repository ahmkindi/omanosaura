package api

import (
	"database/sql"
	"fmt"
	"omanosaura/database"
	"omanosaura/thawani"
	"omanosaura/thawani/types/mode"
	"omanosaura/thawani/types/paymentstatus"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (server *Server) HandlerDeleteProduct(c *fiber.Ctx) error {
	return server.Queries.DeleteProduct(c.Context(), c.Params("id"))
}

func (server *Server) HandlerReviewProduct(c *fiber.Ctx) error {
	review := new(database.ReviewProductParams)
	if err := c.BodyParser(review); err != nil {
		return fiber.ErrBadRequest
	}

	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrNotFound
	}

	canRate, err := server.Queries.UserCanRateProduct(c.Context(), database.UserCanRateProductParams{
		ProductID: review.ProductID,
		UserID:    user.ID,
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
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrNotFound
	}

	return server.Queries.DeleteProductReview(c.Context(), database.DeleteProductReviewParams{
		ProductID: c.Params("id"),
		UserID:    user.ID,
	})
}

func (server *Server) HandlerUpsertProduct(c *fiber.Ctx) error {
	product := new(database.UpsertProductParams)
	if err := c.BodyParser(product); err != nil {
		return fiber.ErrBadRequest
	}

	product.ID = strings.ReplaceAll(strings.ToLower(product.Title), " ", "-")

	if err := server.Queries.UpsertProduct(c.Context(), *product); err != nil {
		return fiber.ErrInternalServerError
	}

	return nil
}

func (server *Server) HandlerGetAllProducts(c *fiber.Ctx) error {
	products, err := server.Queries.GetAllProducts(c.Context())
	if err != nil {
		return err
	}

	return c.JSON(products)
}

func (server *Server) HandlerGetProduct(c *fiber.Ctx) error {
	product, err := server.Queries.GetProduct(c.Context(), c.Params("id"))
	if err != nil {
		return err
	}

	return c.JSON(product)
}

func (server *Server) HandlerGetProductReviews(c *fiber.Ctx) error {
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil {
		return err
	}

	product, err := server.Queries.GetProductReviews(c.Context(), database.GetProductReviewsParams{
		ProductID: c.Params("id"),
		Page:      int32(page),
	})
	if err != nil {
		return err
	}

	return c.JSON(product)
}

func (server *Server) HandlerGetUserProductReview(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrForbidden
	}

	productReview, err := server.Queries.GetUserProductReview(c.Context(), database.GetUserProductReviewParams{
		ProductID: c.Params("id"),
		UserID:    user.ID,
	})
	if err != nil {
		return err
	}

	return c.JSON(productReview)
}

func (server *Server) HandlerPurchaseProduct(c *fiber.Ctx) error {
	req := new(PurchaseProductReq)
	if err := c.BodyParser(req); err != nil {
		return fiber.ErrBadRequest
	}

	if req.ChosenDate.Before(time.Now().AddDate(0, 0, 1)) {
		return fiber.ErrUnauthorized
	}

	product, err := server.Queries.GetBasicProduct(c.Context(), req.ProductID)
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

	//TODO: if its in a planned date then whats the discount?

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
		SuccessUrl: fmt.Sprintf("%s/server/user/purchase/success/%s", server.Config.BaseUrl, referenceId),
		CancelUrl:  fmt.Sprintf("%s/trips/%s", server.Config.BaseUrl, product.ID),
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
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrNotFound
	}

	customerId, err := server.Queries.GetUserCustomerId(c.Context(), user.ID)
	if err != nil {
		return err
	}

	session, err := server.ThawaniClient.GetSessionByClientReference(customerId)
	if err != nil {
		return err
	}

	purchase, ok := session.Metadata.(database.InsertPurchaseParams)
	if !ok {
		return fmt.Errorf("Failed to get purchase metadata from session")
	}

	if session.Data.PaymentStatus == paymentstatus.Paid {
		purchase.Paid = true
		err = server.Queries.InsertPurchase(c.Context(), purchase)
		if err != nil {
			return fmt.Errorf("Failed to insert new purchase: %w", err)
		}
	}

	// TODO: Maybe if cancelled or unpaid go to a different page
	return c.Redirect(fmt.Sprintf("%s/user/%s/purchases", server.Config.BaseUrl, user.ID))
}
