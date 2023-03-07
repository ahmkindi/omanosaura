package api

import (
	"bytes"
	"context"
	"fmt"
	"net/smtp"
	"text/template"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jordan-wright/email"
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

	external, err := template.ParseFiles("templates/external-email.html")
	if err != nil {
		return fmt.Errorf("failed to parse external email template: %w", err)
	}
	external.Execute(&externalBody, struct{ Name string }{Name: details.Name})

	internal, err := template.ParseFiles("templates/internal-email.html")
	if err != nil {
		return fmt.Errorf("failed to parse internal email template: %w", err)
	}
	internal.Execute(&internalBody, details)

	err = smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{"admin@omanosaura.com"}, internalBody.Bytes())
	if err != nil {
		return fmt.Errorf("failed to send internal email: %w", err)
	}
	err = smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{details.Email}, externalBody.Bytes())
	if err != nil {
		return fmt.Errorf("failed to send external email: %w", err)
	}

	return nil
}

func (server *Server) NotifyOfPurchase(purchaseID uuid.UUID) error {
	e := email.NewEmail()

	details, err := server.Queries.GetNotifyPurchaseDetails(context.Background(), purchaseID)
	var htmlBody bytes.Buffer
	var textBody bytes.Buffer

	html, err := template.ParseFiles("templates/purchase.html")
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	html.Execute(&htmlBody, details)

	text, err := template.ParseFiles("templates/purchase.txt")
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	text.Execute(&textBody, details)

	e.From = "Omanosaura No-Reply <no-reply@omanosaura.com>"
	e.To = []string{details.Email}
	e.Subject = "Purchase Success " + purchaseID.String()
	e.Text = textBody.Bytes()
	e.HTML = htmlBody.Bytes()

	return e.Send(server.Email.SmtpURL, server.Email.Auth)
}
