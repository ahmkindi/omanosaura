package api

import (
	"fmt"
	"log"
	"omanosaura/database"
	"omanosaura/utils"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (server *Server) HandlerGetUser(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrNotFound
	}
	return c.JSON(user)
}

func (server *Server) HandlerUserLogin(c *fiber.Ctx) error {

	redirectTo := fmt.Sprintf(`%s/fa/oauth2/authorize?client_id=%s&redirect_uri=%s/server/oauth-callback&response_type=code`,
		server.Config.BaseUrl,
		server.Config.FusionClientID,
		server.Config.BaseUrl)

	fmt.Print(redirectTo)

	return c.Redirect(redirectTo)
}

func (server *Server) HandlerUpdateUser(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(database.User)
	if !ok {
		return fiber.ErrNotFound
	}

	updatedUser := new(database.UpsertUserParams)
	if err := c.BodyParser(updatedUser); err != nil {
		return fiber.ErrBadRequest
	}
	updatedUser.ID = user.ID

	resp, fusionErr, err := server.FusionClient.UpdateUser(user.ID.String(), fusionauth.UserRequest{
		ApplicationId: server.Config.FusionApplicationID,
		User: fusionauth.User{
			FirstName:   updatedUser.Firstname,
			LastName:    updatedUser.Lastname,
			Email:       updatedUser.Email,
			MobilePhone: updatedUser.Phone,
		},
	})
	if resp.StatusCode != 200 || fusionErr != nil || err != nil {
		return fmt.Errorf("failed to update user: %d %+v %w", resp.StatusCode, fusionErr, err)
	}

	return server.Queries.UpsertUser(c.Context(), *updatedUser)
}

func (server *Server) HandlerOauthCallback(c *fiber.Ctx) error {
	token, fusionErr, err := server.FusionClient.ExchangeOAuthCodeForAccessToken(
		c.Query("code"),
		server.Config.FusionClientID,
		server.Config.FusionClientSecret,
		fmt.Sprintf("%s/server/oauth-callback", server.Config.BaseUrl),
	)
	if err != nil || fusionErr != nil {
		return fiber.ErrInternalServerError
	}

	sess, err := server.Store.Get(c)
	if err != nil {
		return err
	}

	sess.Set("token", token.AccessToken)
	err = sess.Save()
	if err != nil {
		return err
	}

	user, authErr, err := server.FusionClient.RetrieveUserUsingJWT(token.AccessToken)
	if err != nil || authErr != nil {
		log.Println("Failed to get user from access token ", authErr, err)
		return err
	}
	userID, err := uuid.Parse(user.User.Id)
	if err != nil {
		log.Println("failed to parse user id to uuid", user.User.Id, err)
		return err
	}
	err = server.Queries.UpsertUser(c.Context(), database.UpsertUserParams{
		ID:        userID,
		Email:     user.User.Email,
		Firstname: user.User.FirstName,
		Lastname:  user.User.LastName,
		Phone:     user.User.MobilePhone,
	})

	return c.Redirect(server.Config.BaseUrl)
}

func (server *Server) HandlerLogout(c *fiber.Ctx) error {
	sess, err := server.Store.Get(c)
	if err != nil {
		return c.Next()
	}

	sess.Destroy()
	return c.Redirect(fmt.Sprintf("%s/fa/oauth2/logout?client_id=%s",
		server.Config.BaseUrl,
		server.Config.FusionClientID,
	))
}

func (server *Server) UserMiddleware(c *fiber.Ctx) error {
	fmt.Println("SESSION ID COOKIE", c.Cookies("session_id"))
	sess, err := server.Store.Get(c)
	if err != nil {
		return c.Next()
	}
	if !utils.Contains(sess.Keys(), "token") {
		log.Println("No token found in session")
		return c.Next()
	}
	token := fmt.Sprintf("%+v", sess.Get("token"))

	valid, err := server.FusionClient.ValidateJWT(token)
	if err != nil {
		log.Println("failed to validate token")
		return c.Next()
	}
	if valid.StatusCode != 200 {
		log.Println("token is invalid")
		sess.Destroy()
		return c.Next()
	}

	user, fusionErr, err := server.FusionClient.RetrieveUserUsingJWT(token)
	if err != nil || fusionErr != nil {
		log.Println("Failed to get user from access token ", fusionErr, err)
		return c.Next()
	}
	c.Locals("user", database.User{
		ID:        uuid.MustParse(user.User.Id),
		Email:     user.User.Email,
		Firstname: user.User.FirstName,
		Lastname:  user.User.LastName,
		Phone:     user.User.MobilePhone,
	})
	c.Locals("roles", utils.GetRoles(user.User.Registrations, server.Config.FusionApplicationID))

	return c.Next()
}

func (server *Server) AdminMiddleware(c *fiber.Ctx) error {
	roles, ok := c.Locals("roles").([]string)
	if !ok {
		return fiber.ErrForbidden
	}
	if !utils.Contains(roles, "admin") {
		return fiber.ErrForbidden
	}

	return c.Next()
}
