package api

import (
	"log"
	"omanosaura/database"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (server *Server) HandlerUpsertTrip(c *fiber.Ctx) error {
	trip := new(database.UpsertTripParams)
	if err := c.BodyParser(trip); err != nil {
		return fiber.ErrBadRequest
	}

	if trip.ID == uuid.Nil {
		log.Print("Inserting New Trip")
		trip.ID = uuid.New()
	}

	if err := server.Queries.UpsertTrip(c.Context(), *trip); err != nil {
		return fiber.ErrInternalServerError
	}

	return nil
}

func (server *Server) HandlerGetAllTrips(c *fiber.Ctx) error {
	trips, err := server.Queries.GetAllTrips(c.Context())
	if err != nil {
		return fiber.ErrInternalServerError
	}

	return c.JSON(trips)
}

func (server *Server) HandlerGetTrip(c *fiber.Ctx) error {
	tripID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.ErrBadRequest
	}
	trip, err := server.Queries.GetTrip(c.Context(), tripID)
	if err != nil {
		return fiber.ErrInternalServerError
	}

	return c.JSON(trip)
}
