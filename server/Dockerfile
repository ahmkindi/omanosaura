FROM golang:1.19.1 as development
# Add a work directory
WORKDIR /app

# Cache and install dependencies
# currently no dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy app files
COPY . .
# Install Reflex for development
RUN go install github.com/cespare/reflex@latest
# Expose port
EXPOSE 8081
# Start app
CMD reflex -g '*.go' go run main.go --start-service

FROM golang:1.19.1 as builder
# Define build env
ENV GOOS linux
ENV CGO_ENABLED 0

# Add a work directory
WORKDIR /app
# Cache and install dependencies
COPY go.mod go.sum ./
RUN go mod download
# Copy app files
COPY . .
# Build app
RUN go build -o app

FROM alpine:3.14 as production
# Add certificates
RUN apk add --no-cache ca-certificates
# Copy built binary from builder
COPY --from=builder app .
# Expose port
EXPOSE 8081
# Exec built binary
CMD ./app
