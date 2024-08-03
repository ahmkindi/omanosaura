package handlers

import "github.com/labstack/echo/v4"

func (s *Server) InitRoutes(router *echo.Router) {
	router.Add("GET", "/", s.GetProductsPage)
}
