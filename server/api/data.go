package api

type Contact struct {
	Name    string
	Email   string
	Subject string
	Message string
}

type Config struct {
	FusionClientID      string
	FusionClientSecret  string
	FusionRedirectURI   string
	FusionApplicationID string
	FusionAPIKey        string
	Domain              string
}

type IntrospectReq struct {
	ClientID string `json:"client_id"`
	Token    string `json:"token"`
}
