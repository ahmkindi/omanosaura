package api

import (
	"fmt"
	"log"
	"omanosaura/database"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const (
	FirebaseAuthKey = "FIREBASE_ID_TOKEN" // Represents the header key for firebase id token
)

// JWTMiddlwareFunc verifies the passed JWT token
func (s *Server) JWTMiddlware(c *fiber.Ctx) error {
	token := strings.TrimPrefix(c.GetReqHeaders()["Authorization"], "Bearer ")

	idToken, err := s.AuthClient.VerifyIDToken(c.Context(), token)
	if err != nil {
		log.Println("No token found in session")
		return c.Next()
	}

	c.Set(FirebaseAuthKey, idToken.UID)
	return c.Next()
}

func (s *Server) AdminMiddleware(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(uuid.UUID)
	if !ok {
		return fmt.Errorf("failed to get user id from local in admin middleware")
	}
	user, err := s.Queries.GetUser(c.Context(), userId)
	if err != nil {
		return fmt.Errorf("failed to get user in admin middleware: %w", err)
	}

	if user.Role != database.UserRoleAdmin {
		return fiber.ErrForbidden
	}

	return c.Next()
}

func (s *Server) HandlerAddUser(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(uuid.UUID)
	if !ok {
		return fmt.Errorf("failed to get user id from local in admin middleware")
	}

	user, err := s.AuthClient.GetUser(c.Context(), userId.String())
	if err != nil {
		return fmt.Errorf("failed to get user from auth client: %w", err)
	}

	return s.Queries.InsertUser(c.Context(), database.InsertUserParams{
		ID:    userId,
		Email: user.Email,
		Phone: user.PhoneNumber,
		Name:  user.DisplayName,
		Role:  database.UserRoleNone,
	})
}

func (server *Server) HandlerUpdateUser(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(uuid.UUID)
	if !ok {
		return fmt.Errorf("failed to get user id from local in admin middleware")
	}

	updatedUser := new(database.UpdateUserParams)
	if err := c.BodyParser(updatedUser); err != nil {
		return fiber.ErrBadRequest
	}

	params := (&auth.UserToUpdate{}).
		PhoneNumber(updatedUser.Phone).
		DisplayName(updatedUser.Phone)

	_, err := server.AuthClient.UpdateUser(c.Context(), userId.String(), params)
	if err != nil {
		return fmt.Errorf("failed to update user: %w %+v %w", err)
	}

	return server.Queries.UpdateUser(c.Context(), *updatedUser)
}

func (s *Server) HandlerGetUser(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(uuid.UUID)
	if !ok {
		return fmt.Errorf("failed to get user id from local in admin middleware")
	}

	user, err := s.Queries.GetUser(c.Context(), userId)
	if err != nil {
		return fmt.Errorf("failed to get user in admin middleware: %w", err)
	}

	return c.JSON(user)
}
