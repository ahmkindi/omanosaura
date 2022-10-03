package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"omanosaura/database"
	"omanosaura/utils"

	"github.com/gofiber/fiber/v2"
)

func (server *Server) HandlerGetUser(c *fiber.Ctx) error {
	return c.JSON(database.User{
		Email: "test@test.com",
	})
}

func (server *Server) HandlerUserLogin(c *fiber.Ctx) error {

	redirectTo := fmt.Sprintf(`http://%s:9011/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=code`,
		server.Config.Domain,
		server.Config.FusionClientID,
		server.Config.FusionRedirectURI)

	return c.Redirect(redirectTo)
}

func (server *Server) HandlerOauthCallback(c *fiber.Ctx) error {
	token, fusionErr, err := server.FusionClient.ExchangeOAuthCodeForAccessToken(
		c.Query("code"),
		server.Config.FusionClientID,
		server.Config.FusionClientSecret,
		server.Config.FusionRedirectURI,
	)
	if err != nil || fusionErr != nil {
		return fiber.ErrInternalServerError
	}

	sess, err := server.Store.Get(c)
	if err != nil {
		return err
	}

	sess.Set("token", token.AccessToken)
	sess.Set("userID", token.UserId)
	err = sess.Save()
	if err != nil {
		return err
	}
	accessToken := sess.Get("token")
	log.Printf("TOKEN %+v", accessToken)
	return c.Redirect("http://localhost:3000")
}

func (server *Server) AddUserToContextMiddleWare(c *fiber.Ctx) error {
	sess, err := server.Store.Get(c)
	if err != nil {
		return c.Next()
	}
	if !utils.Contains(sess.Keys(), "token") {
		log.Println("No token found in session")
		return c.Next()
	}
	token := fmt.Sprintf("%+v", sess.Get("token"))
	userID := fmt.Sprintf("%+v", sess.Get("userID"))
	log.Println("token", token)

	body := IntrospectReq{
		ClientID: server.Config.FusionClientID,
		Token:    token,
	}

	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return err
	}

	introspect, err := http.NewRequest("POST", "http://localhost:9011/oauth2/introspect", bytes.NewBuffer([]byte(bodyBytes)))
	if err != nil {
		log.Print("FAILED TO GET INTROSPECT")
		return err
	}

	defer introspect.Body.Close()

	result, err := ioutil.ReadAll(introspect.Body)
	if err != nil {
		return err
	}
	jsonStr := string(result)
	log.Print("RESPONSE FOR INTROSPECT", jsonStr)

	user, fusionErr, err := server.FusionClient.RetrieveUserInfoFromAccessToken(token)
	if err != nil || fusionErr != nil {
		log.Println("Failed to get user from access token ", fusionErr, err)
		return c.Next()
	}

	log.Printf("%+v", user)

	userByUserID, fusionErrors, err := server.FusionClient.RetrieveUser(userID)
	if err != nil || fusionErrors != nil {
		log.Println("Failed to get user from access token ", fusionErr, err)
		return c.Next()
	}

	log.Printf("USER BY USER ID%+v", userByUserID)

	return nil
}
