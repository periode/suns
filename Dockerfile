FROM golang:1.18-alpine AS go

RUN mkdir /app
COPY go.sum /app
COPY go.mod /app
WORKDIR /app
RUN go mod download

COPY cmd /app/cmd
COPY api /app/api
COPY mailer /app/mailer

RUN CGO_ENABLED=1 go build -o bin/api ./cmd/api/main.go
CMD ["/app/bin/api"]
