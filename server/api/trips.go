package api

import (
	"log"
	"net/http"
)

func (server *Server) HandlerInsertTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Inserting Trip")

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerUpdateTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Updating Trip")

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllTrips(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Trips")

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetTripGallery(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting trip gallery")

	w.WriteHeader(http.StatusOK)
}
