package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"text/template"
)

type Contact struct {
	Name    string
	Email   string
	Subject string
	Message string
}

func main() {
	EMAIL_USERNAME := os.Getenv("EMAIL_USERNAME")
	EMAIL_PASSWORD := os.Getenv("EMAIL_PASSWORD")
	emailAuth := smtp.PlainAuth("", EMAIL_USERNAME, EMAIL_PASSWORD, "smtppro.zoho.com")
	headers := "MIME-version: 1.0;\nContent-Type: text/html;"

	http.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		log.Println("Sending")

		var details Contact
		if err := json.NewDecoder(r.Body).Decode(&details); err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
		var externalBody bytes.Buffer
		externalBody.Write([]byte(fmt.Sprintf("Subject: Hey Explorer\n%s\n\n", headers)))
		var internalBody bytes.Buffer
		internalBody.Write([]byte(fmt.Sprintf("Subject: %s\n%s\n\n", details.Subject, headers)))

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

		smtp.SendMail("smtppro.zoho.com:587", emailAuth, EMAIL_USERNAME, []string{"admin@omanosaura.com"}, internalBody.Bytes())
		smtp.SendMail("smtppro.zoho.com:587", emailAuth, EMAIL_USERNAME, []string{details.Email}, externalBody.Bytes())

		w.WriteHeader(http.StatusOK)
	})

	http.ListenAndServe(":8081", nil)
}
