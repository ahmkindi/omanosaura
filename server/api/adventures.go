package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/models"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerInsertOrUpdateAdventure(w http.ResponseWriter, r *http.Request) {
	log.Print("Inserting Adventure")
	var adventure models.Adventure
	if err := json.NewDecoder(r.Body).Decode(&adventure); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if adventure.Id == uuid.Nil {
		adventure.Id = uuid.Must(uuid.NewRandom())
	}

	if err := server.adventuresStore.InsertOrUpdateAdventure(r.Context(), adventure); err != nil {
		log.Println("failed to insert adventure into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllAdventures(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Adventures")
	adventures, err := server.adventuresStore.GetAllAdventures(r.Context())
	if err != nil {
		log.Println("failed to get adventures from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(adventures); err != nil {
		log.Println("failed to encoding adventures", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (server *Server) HandlerDeleteAdventure(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting adventure")
	advId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert adventure id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.adventuresStore.DeleteAdventure(r.Context(), advId); err != nil {
		log.Println("failed to delelte trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
