/*
Copyright © 2024 Ahmed Al Kindi ahmed@kindi.dev
*/
package cmd

import (
	"context"
	"log"
	"omanosaura/internal/config"
	"omanosaura/internal/handlers"
	"omanosaura/web/app"
	"os"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start omanosara server",
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %s", err)
	}

	ctx := context.Background()

	server, err := handlers.CreateServer(ctx, cfg)
	if err != nil {
		log.Fatalf("failed to create server: %s", err)
	}

	app.LoadApp(server)
}
