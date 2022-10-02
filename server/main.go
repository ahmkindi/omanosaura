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

	// trips
	r.HandleFunc("/trips", server.HandlerGetAllTrips).Methods("GET")
	r.HandleFunc("/trips/{id}", server.HandlerGetTrip).Methods("GET")

	// adventures
	r.HandleFunc("/adventures", server.HandlerGetAllAdventures).Methods("GET")
	r.HandleFunc("/adventure/{id}", server.HandlerGetAdventure).Methods("GET")

	// products
	r.HandleFunc("/products/{id}/like", server.HandlerLikeProduct).Methods("POST")
	r.HandleFunc("/products/{id}/dislike", server.HandlerDislikeProduct).Methods("POST")
	r.HandleFunc("/products/{id}/review", server.HandlerReviewProduct).Methods("POST")
	r.HandleFunc("/products/{id}/review", server.HandlerDeleteReviewProduct).Methods("DELETE")

	// admin routes
	protected := r.PathPrefix("/admin").Subrouter()
	protected.Use(basicAuth)

	protected.HandleFunc("/trips", server.HandlerUpsertTrip).Methods("POST")

	protected.HandleFunc("/adventures", server.HandlerUpsertAdventure).Methods("POST")

	protected.HandleFunc("/product/{id}", server.HandlerDeleteProduct).Methods("DELETE")
	// protected.HandleFunc("/product/{id}/purchases", server.HandlerGetProductPurchases).Methods("GET")
	// protected.HandleFunc("/product/purchases", server.HandlerGetAllPurchases).Methods("GET")
	// protected.HandleFunc("/users", server.HandlerGetAllUsers).Methods("GET")

	http.ListenAndServe(":8081", r)
}
