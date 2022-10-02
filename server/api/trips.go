package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/database"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerUpsertTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Upserting Trip")
	var trip database.UpsertTripParams
	if err := json.NewDecoder(r.Body).Decode(&trip); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if trip.ID == uuid.Nil {
		log.Print("Inserting New Trip")
		trip.ID = uuid.New()
	}

	if err := server.Queries.UpsertTrip(r.Context(), trip); err != nil {
		log.Println("failed to insert trip into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllTrips(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Trips")
	trips, err := server.Queries.GetAllTrips(r.Context())
	if err != nil {
		log.Println("failed to get trips from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(trips); err != nil {
		log.Println("failed to encoding trips", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (server *Server) HandlerGetTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Trip")
	tripID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert trid id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	trips, err := server.Queries.GetTrip(r.Context(), tripID)
	if err != nil {
		log.Println("failed to get trip from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(trips); err != nil {
		log.Println("failed to encoding trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
