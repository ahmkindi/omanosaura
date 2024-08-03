package config

import (
	"fmt"
	"os"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
)

type Config struct {
	DBPass                string `mapstructure:"POSTGRES_PASSWORD"`
	DBUser                string `mapstructure:"POSTGRES_USER"`
	DBHost                string `mapstructure:"POSTGRES_HOST"`
	EmailUsername         string `mapstructure:"EMAIL_USERNAME"`
	EmailPass             string `mapstructure:"EMAIL_PASSOWRD"`
	BaseUrl               string `mapstructure:"BASE_URL"`
	ThawaniApiKey         string `mapstructure:"THAWANI_API_KEY"`
	ThawaniBaseUrl        string `mapstructure:"THAWANI_BASE_URL"`
	ThawaniPublishableKey string `mapstructure:"THAWANI_PUBLISHABLE_KEY"`
	GoogleAppCreds        string `mapstructure:"GOOGLE_APPLICATION_CREDENTIALS"`
}

func Load() (*Config, error) {
	v := viper.New()

	v.SetDefault("PORT", 8081)
	v.SetConfigName(os.Getenv("MODE"))
	v.SetConfigType("env")
	v.AddConfigPath(".")
	v.AddConfigPath("/app/")

	v.AutomaticEnv()

	if err := v.ReadInConfig(); err != nil {
		return nil, err
	}

	var cfg Config
	if err := v.UnmarshalExact(&cfg, func(c *mapstructure.DecoderConfig) {
		c.ErrorUnused = true
		c.WeaklyTypedInput = false
	}); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func (c *Config) GetDBConnStr() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s/postgres?sslmode=disable",
		c.DBUser,
		c.DBPass,
		c.DBHost,
	)
}
