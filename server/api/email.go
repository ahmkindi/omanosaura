package api

import (
	"bytes"
	"context"
	"fmt"
	"omanosaura/database"
	"text/template"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jordan-wright/email"
)

func (server *Server) HandlerSendEmail(c *fiber.Ctx) error {
	e := email.NewEmail()

	details := new(Contact)
	if err := c.BodyParser(details); err != nil {
		return fiber.ErrBadRequest
	}

	var htmlBody bytes.Buffer
	html, err := template.ParseFiles("templates/external-email.html")
	if err != nil {
		return fmt.Errorf("failed to parse external email template: %w", err)
	}
	html.Execute(&htmlBody, details)

	var txtBody bytes.Buffer
	txt, err := template.ParseFiles("templates/external-email.txt")
	if err != nil {
		return fmt.Errorf("failed to parse external email template: %w", err)
	}
	txt.Execute(&txtBody, details)

	e.From = "Omanosaura No-Reply <no-reply@omanosaura.com>"
	e.To = []string{details.Email}
	e.Subject = "Hey Explorer"
	e.Text = txtBody.Bytes()
	e.HTML = htmlBody.Bytes()

	err = e.Send(server.Email.SmtpURL, server.Email.Auth)
	if err != nil {
		fmt.Errorf("failed to send external email: %w", err)
	}

	var inthtmlBody bytes.Buffer
	inthtml, err := template.ParseFiles("templates/internal-email.html")
	if err != nil {
		return fmt.Errorf("failed to parse internal email template: %w", err)
	}
	inthtml.Execute(&inthtmlBody, details)

	var inttxtBody bytes.Buffer
	inttxt, err := template.ParseFiles("templates/internal-email.txt")
	if err != nil {
		return fmt.Errorf("failed to parse external email template: %w", err)
	}
	inttxt.Execute(&inttxtBody, details)

	e.To = []string{"admin@omanosaura.com"}
	e.Subject = "New Message: " + details.Subject
	e.Text = inttxtBody.Bytes()
	e.HTML = inthtmlBody.Bytes()

	err = e.Send(server.Email.SmtpURL, server.Email.Auth)
	if err != nil {
		fmt.Errorf("failed to send internal email: %w", err)
	}

	return nil
}

func (server *Server) NotifyOfPurchase(purchaseID uuid.UUID) error {
	e := email.NewEmail()

	details, err := server.Queries.GetNotifyPurchaseDetails(context.Background(), purchaseID)
	if err != nil {
		return fmt.Errorf("failed to get details to notify: %w", err)
	}
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

func (server *Server) SendWelcomeEmail(user database.User) error {
	e := email.NewEmail()

	var htmlBody bytes.Buffer
	var textBody bytes.Buffer

	html, err := template.ParseFiles("templates/welcome.html")
	if err != nil {
		return fmt.Errorf("failed to parse html welcome email: %w", err)
	}
	html.Execute(&htmlBody, user)

	text, err := template.ParseFiles("templates/welcome.txt")
	if err != nil {
		return fmt.Errorf("failed to parse txt welcome email: %w", err)
	}
	text.Execute(&textBody, user)

	e.From = "Omanosaura No-Reply <no-reply@omanosaura.com>"
	e.To = []string{user.Email}
	e.Subject = "Welcome To Omanosaura"
	e.Text = textBody.Bytes()
	e.HTML = htmlBody.Bytes()

	return e.Send(server.Email.SmtpURL, server.Email.Auth)
}
