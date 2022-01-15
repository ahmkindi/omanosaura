package api

import (
	"encoding/json"
	"log"
	"net/http"
	"omanosaura/models"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerRegisterUser(w http.ResponseWriter, r *http.Request) {
	log.Print("Registering A User")
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("failed to decode request", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	user.Id = uuid.Must(uuid.NewRandom())

	insertedUser, err := server.usersSotre.InsertOrUpdateUser(r.Context(), user)
	if err != nil {
		log.Println("failed to insert user into db", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	eventId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert event id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.usersSotre.InsertEventUser(r.Context(), models.EventUser{UserId: insertedUser.Id, EventId: eventId}); err != nil {
		log.Println("failed to insert user event into db", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerGetAllUsers(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Users")
	users, err := server.usersSotre.GetAllUsers(r.Context())
	if err != nil {
		log.Println("failed to get users from db", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		log.Println("failed to encode users", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
}

func (server *Server) HandlerInterestedUsers(w http.ResponseWriter, r *http.Request) {
	log.Print("Getting Interested Users")

	eventId, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert event id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	users, err := server.usersSotre.GetAllUsersForEvent(r.Context(), eventId)
	if err != nil {
		log.Println("failed to get interested users from db", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		log.Println("failed to encoding events", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
}
