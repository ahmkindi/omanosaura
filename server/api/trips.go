package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/models"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerInsertTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Inserting Trip")
	var trip models.Trip
	if err := json.NewDecoder(r.Body).Decode(&trip); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	trip.Id = uuid.Must(uuid.NewRandom())

	if err := server.tripsStore.InsertTrip(r.Context(), trip); err != nil {
		log.Println("failed to insert trip into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerUpdateTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Updating Trip")
	var trip models.Trip
	if err := json.NewDecoder(r.Body).Decode(&trip); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.tripsStore.UpdateTrip(r.Context(), trip); err != nil {
		log.Println("failed to insert trip into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllTrips(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Trips")
	trips, err := server.tripsStore.GetAllTrips(r.Context())
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

func (server *Server) HandlerDeleteTrip(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting trip")
	tripId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert trip id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.tripsStore.DeleteTrip(r.Context(), tripId); err != nil {
		log.Println("failed to delelte trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetTripPhotos(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting trip photos")
	tripId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert trip id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	photos, err := server.tripsStore.GetTripPhotos(r.Context(), tripId)
	if err != nil {
		log.Println("failed to delelte trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(photos); err != nil {
		log.Println("failed to encoding trips", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (server *Server) HandlerInsertTripPhotos(w http.ResponseWriter, r *http.Request) {
	log.Print("Uploading trip photos")
	var tripPhotos []models.TripPhoto
	if err := json.NewDecoder(r.Body).Decode(&tripPhotos); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	for _, photo := range tripPhotos {
		photo.Id = uuid.Must(uuid.NewRandom())
		if err := server.tripsStore.InsertTripPhoto(r.Context(), photo); err != nil {
			log.Println("failed to insert photo", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerDeleteTripPhoto(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting trip photo")
	photoId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert photo id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.tripsStore.DeleteTripPhoto(r.Context(), photoId); err != nil {
		log.Println("failed to delelte photo", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
