package api

import (
	"fmt"
	"omanosaura/database"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (server *Server) HandlerUpsertBlog(c *fiber.Ctx) error {
	blog := new(database.UpsertBlogParams)
	if err := c.BodyParser(blog); err != nil {
		return fmt.Errorf("failed to parse blog params into struct: %w", err)
	}

	userID, ok := c.Locals(FirebaseAuthKey).(string)
	if !ok {
		return fmt.Errorf("failed to parse user from context")
	}

	blog.ID = strings.ReplaceAll(strings.ToLower(blog.Title), " ", "-")
	blog.UserID = userID

	return server.Queries.UpsertBlog(c.Context(), *blog)
}

func (server *Server) HandlerGetAllBlogs(c *fiber.Ctx) error {
	blogs, err := server.Queries.GetBlogs(c.Context())
	if err != nil {
		return fmt.Errorf("failed to get all blogs: %w", err)
	}

	return c.JSON(blogs)
}

func (server *Server) HandlerGetBlog(c *fiber.Ctx) error {
	blogs, err := server.Queries.GetBlog(c.Context(), c.Params("id"))
	if err != nil {
		return fmt.Errorf("failed to get all blogs: %w", err)
	}

	return c.JSON(blogs)
}

func (server *Server) HandlerDeleteBlog(c *fiber.Ctx) error {
	return server.Queries.DeleteBlog(c.Context(), c.Params("id"))
}
