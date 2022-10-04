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
	app.Get("/logout", server.HandlerLogout)

	users := app.Group("/user", server.UserMiddleware)
	users.Get("/", server.HandlerGetUser)

	// trips
	users.Get("/trips/:id", server.HandlerGetTrip)
	users.Get("/trips", server.HandlerGetAllTrips)

	// adventures
	users.Get("/adventures/:id", server.HandlerGetAdventure)
	users.Get("/adventures", server.HandlerGetAllAdventures)

	// products
	users.Post("/products/rate", server.HandlerRateProduct)
	users.Post("/products/review", server.HandlerReviewProduct)
	users.Post("/products/:id/review", server.HandlerDeleteReviewProduct)
	users.Post("/products/purchase", server.HandlerPurchaseProduct)
	users.Post("/purchase/success/:id", server.HandlerPurchaseSuccess)

	admin := users.Group("/admin", server.AdminMiddleware)
	admin.Delete("/product/:id", server.HandlerDeleteProduct)
	admin.Post("/trips", server.HandlerUpsertTrip)
	admin.Post("/adventures", server.HandlerUpsertAdventure)

	app.Listen(":8081")
}
