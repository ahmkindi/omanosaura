package api

import (
	"fmt"
	"log"
	"omanosaura/database"

	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v4"
)

const (
	FirebaseAuthKey = "FIREBASE_ID_TOKEN" // Represents the header key for firebase id token
)

// JWTMiddlwareFunc verifies the passed JWT token
func (s *Server) JWTMiddlware(c *fiber.Ctx) error {
	token := c.Cookies("token")

	idToken, err := s.AuthClient.VerifyIDToken(c.Context(), token)
	if err != nil {
		log.Println("No token found in cookies: ", token)
		return c.Next()
	}

	c.Locals(FirebaseAuthKey, idToken.UID)
	return c.Next()
}

func (s *Server) AdminMiddleware(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(string)
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

func (server *Server) HandlerUpdateUser(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(string)
	if !ok {
		return fmt.Errorf("failed to get user id from local in update user. %+v", c.Locals(FirebaseAuthKey))
	}

	updatedUser := new(database.UpdateUserParams)
	if err := c.BodyParser(updatedUser); err != nil {
		return fiber.ErrBadRequest
	}

	params := (&auth.UserToUpdate{}).
		DisplayName(updatedUser.Phone)

	_, err := server.AuthClient.UpdateUser(c.Context(), userId, params)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	updatedUser.ID = userId

	return server.Queries.UpdateUser(c.Context(), *updatedUser)
}

func (s *Server) HandlerGetUser(c *fiber.Ctx) error {
	userId, ok := c.Locals(FirebaseAuthKey).(string)
	if !ok {
		return fmt.Errorf("failed to get user id from local in get user: %s", c.Locals(FirebaseAuthKey))
	}

	user, err := s.Queries.GetUser(c.Context(), userId)
	if err != nil && err != pgx.ErrNoRows {
		return fmt.Errorf("failed to get user in admin middleware: %w", err)
	}
	// this could be a new user we need to insert
	if err == pgx.ErrNoRows {
		firebaseUser, err := s.AuthClient.GetUser(c.Context(), userId)
		if err != nil {
			return fmt.Errorf("failed to get user from auth client: %w", err)
		}
		user = database.User{
			ID:    firebaseUser.UID,
			Email: firebaseUser.Email,
			Phone: firebaseUser.PhoneNumber,
			Name:  firebaseUser.DisplayName,
			Role:  database.UserRoleNone,
		}
		err = s.Queries.InsertUser(c.Context(), database.InsertUserParams(user))
		if err != nil {
			return fmt.Errorf("failed to insert user: %w", err)
		}
		go s.SendWelcomeEmail(user)
	}

	return c.JSON(user)
}

func (s *Server) HandlerGetAllUsers(c *fiber.Ctx) error {
	users, err := s.Queries.GetAllUsers(c.Context())
	if err != nil {
		return fmt.Errorf("failed to get all user: %w", err)
	}

	return c.JSON(users)
}

func (s *Server) HandlerUpdateUserRole(c *fiber.Ctx) error {
	role := c.Query("role", "none")
	userID := c.Params("id")

	err := s.Queries.UpdateUserRole(c.Context(), database.UpdateUserRoleParams{ID: userID, Role: database.UserRole(role)})
	if err != nil {
		return fmt.Errorf("failed to get all update user role: %w", err)
	}

	return nil
}
