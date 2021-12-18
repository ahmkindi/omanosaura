package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"log"
	"net/http"
	"omanosaura/api"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func basicAuth(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		log.Println("authenticating")
		username, password, ok := r.BasicAuth()
		log.Println(username, password)
		if ok {
			usernameHash := sha256.Sum256([]byte(username))
			passwordHash := sha256.Sum256([]byte(password))
			expectedUsernameHash := sha256.Sum256([]byte(os.Getenv("ADMIN_USERNAME")))
			expectedPasswordHash := sha256.Sum256([]byte(os.Getenv("ADMIN_PASSWORD")))
			usernameMatch := (subtle.ConstantTimeCompare(usernameHash[:], expectedUsernameHash[:]) == 1)
			passwordMatch := (subtle.ConstantTimeCompare(passwordHash[:], expectedPasswordHash[:]) == 1)
			if usernameMatch && passwordMatch {
				next.ServeHTTP(w, r)
				return
			}
		}
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}

	return http.HandlerFunc(fn)
}

func main() {

	server, err := api.CreateServer()
	if err != nil {
		log.Fatal(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/send", server.HandlerSendEmail).Methods("POST")
	r.HandleFunc("/trips", server.HandlerGetAllTrips).Methods("GET")
	r.HandleFunc("/trips/photos/{id}", server.HandlerGetTripPhotos).Methods("GET")

	protected := r.PathPrefix("/admin").Subrouter()
	protected.Use(basicAuth)
	protected.HandleFunc("/trips", server.HandlerInsertTrip).Methods("POST")
	protected.HandleFunc("/trips", server.HandlerUpdateTrip).Methods("PUT")
	protected.HandleFunc("/trips/delete/{id}", server.HandlerDeleteTrip).Methods("POST")
	protected.HandleFunc("/trips/photos", server.HandlerInsertTripPhotos).Methods("POST")
	protected.HandleFunc("/trips/photos/{id}", server.HandlerDeleteTripPhoto).Methods("DELETE")
	protected.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("POST")

	http.ListenAndServe(":8081", r)
}