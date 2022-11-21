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
	"github.com/jackc/pgx/v4"
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
		return fmt.Errorf("Failed to parse product to upsert: %w", err)
	}

	product.ID = strings.ReplaceAll(strings.ToLower(product.Title), " ", "-")

	if err := server.Queries.UpsertProduct(c.Context(), *product); err != nil {
		return fmt.Errorf("failed to upsert product: %w", err)
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

func (server *Server) HandlerGetUserPurchases(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrForbidden
	}

	purchases, err := server.Queries.GetUserPurchases(c.Context(), user.ID)
	if err != nil {
		return fmt.Errorf("failed to get user purchases: %w", err)
	}

	return c.JSON(purchases)
}

func (server *Server) HandlerGetAllPurchases(c *fiber.Ctx) error {
	purchases, err := server.Queries.GetAllPurchases(c.Context())
	if err != nil {
		return fmt.Errorf("failed to get all purchases: %w", err)
	}

	return c.JSON(purchases)
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
		return fiber.ErrUnauthorized
	}

	// 20% off for trips if more than 4 are attending
	if product.Kind == "trip" && req.Quantity > 4 {
		product.PriceBaisa = product.PriceBaisa * 80 / 100
	}

	purchase := database.InsertPurchaseParams{
		ID:                uuid.New(),
		ProductID:         product.ID,
		UserID:            user.ID,
		NumOfParticipants: int32(req.Quantity),
		Paid:              false,
		ChosenDate:        req.ChosenDate,
		CostBaisa:         int64(req.Quantity) * product.PriceBaisa,
		Complete:          req.Cash,
	}
	err = server.Queries.InsertPurchase(c.Context(), purchase)
	if err != nil {
		return fmt.Errorf("failed to insert purchase: %w", err)
	}
	if req.Cash {
		go func(purchaseID uuid.UUID) {
			err := server.NotifyOfPurchase(purchase.ID)
			if err != nil {
				fmt.Println("error notifying of purchase ", err.Error())
			}
		}(purchase.ID)
		return nil
	}

	customerId, err := server.Queries.GetUserCustomerId(c.Context(), user.ID)
	if err != nil && err != pgx.ErrNoRows {
		return fmt.Errorf("failed to get customer id: %w", err)
	}
	if err != sql.ErrNoRows {
		customer, err := server.ThawaniClient.CreateCustomer(thawani.CreateCustomerReq{
			ClientCustomerId: user.ID.String(),
		})
		if err != nil {
			return fmt.Errorf("failed to create customer: %w", err)
		}
		customerId = customer.Data.Id
	}

	fmt.Printf("purchase created is: %+v", purchase)
	newSessionReq := thawani.CreateSessionReq{
		ClientReferenceId: purchase.ID.String(),
		Mode:              mode.Payment,
		Products: []thawani.Product{{
			Name:       product.Title,
			Quantity:   req.Quantity,
			UnitAmount: int(product.PriceBaisa),
		}},
		SuccessUrl: fmt.Sprintf("%s/server/user/purchase/success/%s", server.Config.BaseUrl, purchase.ID),
		CancelUrl:  fmt.Sprintf("%s/experiences/%s", server.Config.BaseUrl, product.ID),
		CustomerId: customerId,
	}

	_, redirectURI, err := server.ThawaniClient.CreateSession(newSessionReq)
	if err != nil {
		return fmt.Errorf("failed to create thawani session: %w", err)
	}

	// return c.Redirect(fmt.Sprintf("%s/pay/%s?key=%s", server.Config.BaseUrl, s.Data.SessionId, server.Config.ThawaniPublishableKey))
	return c.JSON(redirectURI)
}

func (server *Server) HandlerPurchaseSuccess(c *fiber.Ctx) error {
	session, err := server.ThawaniClient.GetSessionByClientReference(c.Params("id"))
	if err != nil {
		return fmt.Errorf("failed to get session from client reference: %w", err)
	}

	purchaseID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fmt.Errorf("failed to parse client reference id into uuid: %w", err)
	}

	if session.Data.PaymentStatus == paymentstatus.Paid {
		err = server.Queries.CompletePurchase(c.Context(), purchaseID)
		if err != nil {
			return fmt.Errorf("Failed to update purchase to complete: %w", err)
		}
	}

	go server.NotifyOfPurchase(purchaseID)

	// TODO: Maybe if cancelled or unpaid go to a different page
	return c.Redirect(fmt.Sprintf("%s/purchases", server.Config.BaseUrl))
}
