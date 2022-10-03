package api

import (
	"log"
	"omanosaura/database"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (server *Server) HandlerUpsertAdventure(c *fiber.Ctx) error {
	adventure := new(database.UpsertAdventureParams)
	if err := c.BodyParser(adventure); err != nil {
		return fiber.ErrBadRequest
	}

	if adventure.ID == uuid.Nil {
		log.Print("Inserting New Adventure")
		adventure.ID = uuid.New()
	}

	if err := server.Queries.UpsertAdventure(c.Context(), *adventure); err != nil {
		return fiber.ErrInternalServerError
	}

	return nil
}

func (server *Server) HandlerGetAllAdventures(c *fiber.Ctx) error {
	adventures, err := server.Queries.GetAllAdventures(c.Context())
	if err != nil {
		return fiber.ErrInternalServerError
	}

	return c.JSON(adventures)
}

func (server *Server) HandlerGetAdventure(c *fiber.Ctx) error {
	adventureID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.ErrBadRequest
	}
	adventure, err := server.Queries.GetAdventure(c.Context(), database.GetAdventureParams{
		ProductID: adventureID,
		UserID:    uuid.Nil,
	})
	if err != nil {
		return fiber.ErrInternalServerError
	}

	return c.JSON(adventure)
}
