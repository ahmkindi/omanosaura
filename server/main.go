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

	// trips
	app.Get("/trips/:id", server.HandlerGetTrip)
	app.Get("/trips", server.HandlerGetAllTrips)
	app.Post("/trips", server.HandlerUpsertTrip)

	// adventures
	app.Get("/adventures/:id", server.HandlerGetAdventure)
	app.Get("/adventures", server.HandlerGetAllAdventures)
	app.Post("/adventures", server.HandlerUpsertAdventure)

	// products
	app.Post("/products/:id/rate", server.HandlerRateProduct)
	app.Post("/products/:id/review", server.HandlerReviewProduct)
	app.Post("/products/:id/review", server.HandlerDeleteReviewProduct)
	app.Delete("/product/:id", server.HandlerDeleteProduct)

	// protected.HandleFunc("/product/{id}/purchases", server.HandlerGetProductPurchases).Methods("GET")
	// protected.HandleFunc("/product/purchases", server.HandlerGetAllPurchases).Methods("GET")
	// protected.HandleFunc("/users", server.HandlerGetAllUsers).Methods("GET")

	app.Get("/user", server.HandlerGetUser)
	app.Get("/user/login", server.HandlerUserLogin)
	app.Get("/oauth-callback", server.HandlerOauthCallback)
	app.Get("/test", server.AddUserToContextMiddleWare)

	app.Listen(":8081")
}
