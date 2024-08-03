package app

import (
	"omanosaura/internal/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func LoadApp(server *handlers.Server) {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Static("/static", "./web/static")
	server.InitRoutes(e.Router())

	e.Logger.Fatal(e.Start(":3000"))
}
