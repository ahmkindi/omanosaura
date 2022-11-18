package main

import (
	"log"
	"omanosaura/api"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {

	server, err := api.CreateServer()
	if err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())
	app.Post("/send", server.HandlerSendEmail)
	app.Get("/login", server.HandlerUserLogin)
	app.Get("/oauth-callback", server.HandlerOauthCallback)
	app.Get("/products", server.HandlerGetAllProducts)
	app.Get("/products/:id/reviews", server.HandlerGetProductReviews)
	app.Get("/products/:id", server.HandlerGetProduct)
	app.Get("/blogs", server.HandlerGetAllBlogs)
	app.Get("/blogs/:id", server.HandlerGetBlog)

	users := app.Group("/user", server.UserMiddleware)
	users.Get("/", server.HandlerGetUser)
	users.Put("/", server.HandlerUpdateUser)
	users.Get("/logout", server.HandlerLogout)

	users.Post("/products/review", server.HandlerReviewProduct)
	users.Get("/products/:id/review", server.HandlerGetUserProductReview)
	users.Delete("/products/:id/review", server.HandlerDeleteReviewProduct)
	users.Post("/products/purchase", server.HandlerPurchaseProduct)
	users.Get("/products/purchase", server.HandlerGetUserPurchases)
	users.Get("/purchase/success/:id", server.HandlerPurchaseSuccess)

	admin := users.Group("/admin", server.AdminMiddleware)
	admin.Delete("/products/:id", server.HandlerDeleteProduct)
	admin.Post("/products", server.HandlerUpsertProduct)
	admin.Post("/blogs", server.HandlerUpsertBlog)
	admin.Delete("/blogs/:id", server.HandlerDeleteBlog)
	admin.Get("/products/purchases", server.HandlerGetAllPurchases)

	app.Listen(":8081")
}
