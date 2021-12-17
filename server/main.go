package main

import (
	"log"
	"net/http"
	"omanosaura/api"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {

	server, err := api.CreateServer()
	if err != nil {
		log.Fatal(err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/send", server.HandlerSendEmail).Methods("POST")
	r.HandleFunc("/trips", server.HandlerInsertTrip).Methods("POST")
	r.HandleFunc("/trips", server.HandlerUpdateTrip).Methods("PUT")
	r.HandleFunc("/trips", server.HandlerGetAllTrips).Methods("GET")
	r.HandleFunc("/trips/gallery/{id}", server.HandlerGetTripGallery).Methods("GET")

	http.ListenAndServe(":8081", r)
}
