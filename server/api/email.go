package api

import (
	"bytes"
	"fmt"
	"net/smtp"
	"text/template"

	"github.com/gofiber/fiber/v2"
)

func (server *Server) HandlerSendEmail(c *fiber.Ctx) error {
	details := new(Contact)
	if err := c.BodyParser(details); err != nil {
		return fiber.ErrBadRequest
	}
	var externalBody bytes.Buffer
	externalBody.Write([]byte(fmt.Sprintf("Subject: Hey Explorer\n%s\n\n", server.Email.Headers)))
	var internalBody bytes.Buffer
	internalBody.Write([]byte(fmt.Sprintf("Subject: %s\n%s\n\n", details.Subject, server.Email.Headers)))

	external, err := template.ParseFiles("external-email.html")
	if err != nil {
		return fiber.ErrInternalServerError
	}
	external.Execute(&externalBody, struct{ Name string }{Name: details.Name})

	internal, err := template.ParseFiles("internal-email.html")
	if err != nil {
		return fiber.ErrInternalServerError
	}
	internal.Execute(&internalBody, details)

	smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{"admin@omanosaura.com"}, internalBody.Bytes())
	smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{details.Email}, externalBody.Bytes())

	return nil
}
