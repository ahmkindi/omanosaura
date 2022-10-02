package api

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func (server *Server) HandlerDeleteProduct(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting Product")
	productID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert productID id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := server.Queries.DeleteProduct(r.Context(), productID); err != nil {
		log.Println("failed to delelte trip", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerLikeProduct(w http.ResponseWriter, r *http.Request) {
	log.Print("Liking Product")
	productID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert productID id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	log.Print(productID)

	// get User and insert
	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerDislikeProduct(w http.ResponseWriter, r *http.Request) {
	log.Print("Disliking Product")
	productID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert productID id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	log.Print(productID)

	// get User and delete
	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerReviewProduct(w http.ResponseWriter, r *http.Request) {
	log.Print("Review Product")
	productID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert productID id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	log.Print(productID)

	// get User and insert
	w.WriteHeader(http.StatusOK)
}

func (server *Server) HandlerDeleteReviewProduct(w http.ResponseWriter, r *http.Request) {
	log.Print("Deleting Review Product")
	productID, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		log.Println("failed to convert productID id into uuid", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	log.Print(productID)

	// get User and delete
	w.WriteHeader(http.StatusOK)
}
