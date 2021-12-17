package migrations

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
	"net/http"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/httpfs"
	"github.com/pkg/errors"
)

//go:embed sql
var migrations embed.FS

// Migrate migrates the datbase to the latest revision.
func Migrate(db *sql.DB) error {
	sourceInstance, err := httpfs.New(http.FS(migrations), "sql")
	if err != nil {
		return fmt.Errorf("failed to create source instance, got: %w", err)
	}

	targetInstance, err := postgres.WithInstance(db, &postgres.Config{})

	if err != nil {
		return fmt.Errorf("failed to create database instance, got: %w", err)
	}

	migrateInstance, err := migrate.NewWithInstance(
		"httpfs", sourceInstance,
		"postgres", targetInstance,
	)

	if err != nil {
		return fmt.Errorf("failed to create migrations, got: %w", err)
	}

	err = migrateInstance.Up()

	if err != nil {
		v, dirty, _ := migrateInstance.Version()
		switch errors.Cause(err) {
		case migrate.ErrNoChange:
			log.Printf("db is at version (%d). No database migrations to apply", v)
			return nil
		default:
			log.Printf("current version: %d, dirty: %v", v, dirty)

			if dirty {
				err := migrateInstance.Force(int(v - 1))
				if err != nil {
					return fmt.Errorf("failed to force migration version: %w", err)
				}
			}

			log.Printf("forcing back to version (%d)", v-1)

			return fmt.Errorf("error running migration, got: %w", err)
		}
	}

	log.Println("successfully applied migration")
	return nil
}
