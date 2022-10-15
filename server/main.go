package main

import (
	"log"
	"omanosaura/api"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

func main() {

	server, err := api.CreateServer()
	if err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	app.Post("/send", server.HandlerSendEmail)
	app.Get("/login", server.HandlerUserLogin)
	app.Get("/oauth-callback", server.HandlerOauthCallback)

	users := app.Group("/user", server.UserMiddleware)
	users.Get("/", server.HandlerGetUser)
	users.Get("/logout", server.HandlerLogout)

	users.Get("/products", server.HandlerGetAllProducts)
	users.Post("/products/rate", server.HandlerRateProduct)
	users.Post("/products/review", server.HandlerReviewProduct)
	users.Post("/products/purchase", server.HandlerPurchaseProduct)
	users.Post("/purchase/success/:id", server.HandlerPurchaseSuccess)
	users.Get("/products/:id", server.HandlerGetProduct)
	users.Post("/products/:id/review", server.HandlerDeleteReviewProduct)

	admin := users.Group("/admin", server.AdminMiddleware)
	admin.Delete("/products/:id", server.HandlerDeleteProduct)
	admin.Post("/products", server.HandlerUpsertProduct)

	app.Listen(":8081")
}
