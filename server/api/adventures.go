package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/database"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerUpsertAdventure(w http.ResponseWriter, r *http.Request) {
	log.Print("Upserting Adventure")
	var adventure database.UpsertAdventureParams
	if err := json.NewDecoder(r.Body).Decode(&adventure); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if adventure.ID == uuid.Nil {
		log.Print("Inserting New Adventure")
		adventure.ID = uuid.New()
	}

	if err := server.Queries.UpsertAdventure(r.Context(), adventure); err != nil {
		log.Println("failed to upsert adventure into db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllAdventures(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting All Adventures")
	adventures, err := server.Queries.GetAllAdventures(r.Context())
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

func (server *Server) HandlerGetAdventure(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Adventure")
	adventureID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert adventure id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	adventure, err := server.Queries.GetTrip(r.Context(), adventureID)
	if err != nil {
		log.Println("failed to get adventure from db", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(adventure); err != nil {
		log.Println("failed to encoding adventure", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
