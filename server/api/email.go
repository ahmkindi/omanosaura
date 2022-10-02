package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"text/template"
)

func (server *Server) HandlerSendEmail(w http.ResponseWriter, r *http.Request) {
	log.Println("Sending")
	var details Contact
	if err := json.NewDecoder(r.Body).Decode(&details); err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	var externalBody bytes.Buffer
	externalBody.Write([]byte(fmt.Sprintf("Subject: Hey Explorer\n%s\n\n", server.Email.Headers)))
	var internalBody bytes.Buffer
	internalBody.Write([]byte(fmt.Sprintf("Subject: %s\n%s\n\n", details.Subject, server.Email.Headers)))

	external, err := template.ParseFiles("external-email.html")
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	external.Execute(&externalBody, struct{ Name string }{Name: details.Name})

	internal, err := template.ParseFiles("internal-email.html")
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	internal.Execute(&internalBody, details)

	smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{"admin@omanosaura.com"}, internalBody.Bytes())
	smtp.SendMail(server.Email.SmtpURL, server.Email.Auth, server.Email.Username, []string{details.Email}, externalBody.Bytes())

	w.WriteHeader(http.StatusOK)
}
