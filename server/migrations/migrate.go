package migrations

import (
	"database/sql"
	"embed"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/pgx"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/pkg/errors"
)

//go:embed schema
var schema embed.FS

// Migrate migrates the datbase to the latest revision.
func Migrate(connStr string) error {
	sourceDriver, err := iofs.New(schema, "schema")
	if err != nil {
		return fmt.Errorf("failed to create driver: %w", err)
	}

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		return err
	}
	defer db.Close()

	databaseDriver, err := pgx.WithInstance(db, &pgx.Config{})
	if err != nil {
		return fmt.Errorf("failed to create database driver: %w", err)
	}

	migrateInstance, err := migrate.NewWithInstance(
		"iofs", sourceDriver,
		"postgres", databaseDriver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
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
