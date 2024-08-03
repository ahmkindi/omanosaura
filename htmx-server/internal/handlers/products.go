package handlers

import (
	"omanosaura/web/templates"
	"omanosaura/web/templates/pages"
	"omanosaura/web/utils"

	"github.com/labstack/echo/v4"
)

func (s *Server) GetProductsPage(c echo.Context) error {
	return utils.RenderPage(c, templates.Props{
		Lang:     "en",
		Title:    "Products",
		Contents: pages.HomePage(),
	})
}
