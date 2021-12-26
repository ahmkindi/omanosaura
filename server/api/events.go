package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/models"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerInsertOrUpdateEvent(w http.ResponseWriter, r *http.Request) {
	log.Print("Inserting Event")
	var event models.Event
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if event.Id == uuid.Nil {
		event.Id = uuid.Must(uuid.NewRandom())
	}

	if err := server.eventsStore.InsertOrUpdateEvent(r.Context(), event); err != nil {
		log.Println("failed to insert event into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllEvents(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Events")
	events, err := server.eventsStore.GetAllEvents(r.Context())
	if err != nil {
		log.Println("failed to get events from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(events); err != nil {
		log.Println("failed to encoding events", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (server *Server) HandlerGetCurrentEvents(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Events")
	events, err := server.eventsStore.GetCurrentEvents(r.Context())
	if err != nil {
		log.Println("failed to get events from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(events); err != nil {
		log.Println("failed to encoding events", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (server *Server) HandlerDeleteEvent(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting event")
	eventId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert event id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.eventsStore.DeleteEvent(r.Context(), eventId); err != nil {
		log.Println("failed to delelte trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
