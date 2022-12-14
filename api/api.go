package api

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/periode/suns/api/auth"
	"github.com/periode/suns/api/handlers"
	zero "github.com/periode/suns/api/logger"
)

var conf Config

// StartServer gets his port and debug in the environment, registers the router, and registers the database closing on exit.
func StartServer(port string, c Config) {
	conf = c

	err := os.MkdirAll(c.UploadsDir, os.ModePerm)
	if err != nil {
		panic(err)
	}
	os.MkdirAll(filepath.Join(c.UploadsDir, "marks"), os.ModePerm)
	os.MkdirAll(filepath.Join(c.UploadsDir, "uploads"), os.ModePerm)

	router := SetupRouter()
	s := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// from https://gist.github.com/ivan3bx/b0f14449803ce5b0aa72afaa1dfc75e1
	go func() {
		zero.Log.Info().Str("port", port).Str("mode", os.Getenv("API_MODE")).Msg("server started")
		if err := s.ListenAndServe(); err != http.ErrServerClosed {
			panic(err)
		}
	}()

	shutdown := make(chan os.Signal, 2)
	if os.Getenv("API_MODE") != "test" {
		signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)
		<-shutdown // block until signal received
		zero.Log.Info().Msg("shutting down... ciao!")
		s.Shutdown(context.Background())
	}
}

// SetupRouter registers all middleware, templates, logging route groups and settings
func SetupRouter() *echo.Echo {
	r := echo.New()

	r.Use(middleware.CORS())
	r.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "\033[32m${time_rfc3339}\033[0m | ${method} | ${uri} | ${status} | ${remote_ip} | ${error.message}\n",
	}))
	r.Use(middleware.Recover())
	r.Use(middleware.BodyLimit("256M"))
	r.Use(injectConfig)

	r.Static("/static", conf.UploadsDir)

	r.GET("/ping", handlePing)

	r.POST("/login", auth.Login)
	r.GET("/dashboard", auth.Dashboard)

	a := r.Group("/auth")
	{
		a.POST("/confirm", auth.Confirm)
		a.POST("/request-recover", auth.RequestRecover)
		a.POST("/check-recover", auth.Recover)
	}

	config := r.Group("/config")
	{
		config.GET("/engine", handlers.GetConfig)
		config.POST("/engine", handlers.SetConfig)
	}

	engine := r.Group("/engine")
	{
		engine.GET("/state", handlers.GetState)
	}

	users := r.Group("/users")
	{
		users.GET("/", handlers.GetAllUsers)
		users.GET("/:id", handlers.GetUser)
		users.POST("/", handlers.CreateUser)

		users.PATCH("/:id", handlers.UpdateUser)
		users.PATCH("/:id/prompts", handlers.UpdateUserPrompts)
		users.DELETE("/:id", handlers.DeleteUser)
	}

	clusters := r.Group("/clusters")
	{
		clusters.GET("/", handlers.GetAllClusters)
		clusters.GET("/:id", handlers.GetCluster)

		clusters.POST("/", handlers.CreateCluster)
		clusters.PATCH("/:id", handlers.UpdateCluster)
		clusters.DELETE("/:id", handlers.DeleteCluster)
	}

	entrypoints := r.Group("/entrypoints")
	{
		entrypoints.GET("/", handlers.GetAllEntrypoints)
		entrypoints.GET("/map", handlers.GetMapEntrypoints)
		entrypoints.GET("/cracks", handlers.GetCrackEntrypoints)
		entrypoints.GET("/sacrifice", handlers.GetSacrificedEntrypoints)
		entrypoints.GET("/:id", handlers.GetEntrypoint)

		entrypoints.POST("/", handlers.CreateEntrypoint)
		entrypoints.PATCH("/:id", handlers.UpdateEntrypoint)
		entrypoints.PATCH("/:id/progress", handlers.ProgressEntrypoint)
		entrypoints.PATCH("/:id/claim", handlers.ClaimEntrypoint)
		entrypoints.DELETE("/:id", handlers.DeleteEntrypoint)
	}

	modules := r.Group("/modules")
	{
		modules.GET("/", handlers.GetAllModules)
		modules.GET("/:id", handlers.GetModule)

		modules.POST("/", handlers.CreateModule)
		modules.PATCH("/:id", handlers.UpdateModule)
		modules.DELETE("/:id", handlers.DeleteModule)
	}

	uploads := r.Group("/uploads")
	{
		uploads.POST("/", handlers.CreateUpload)
	}

	r.GET("/", handleNotFound)
	r.POST("/", handleNotFound)

	return r
}

func injectConfig(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		id, err := auth.Authenticate(c)
		if err != nil {
			zero.Log.Warn().Err(err).Msg("error injecting config")
			id = uuid.Nil
		}
		c.Set("user_uuid", id)

		c.Set("config", conf)
		if err := next(c); err != nil {
			c.Error(err)
		}

		return nil
	}
}

func handlePing(c echo.Context) error {
	return c.String(200, "pong")
}

func handleNotFound(c echo.Context) error {
	return c.String(http.StatusNotFound, "SUNS - we couldn't find the requested resource, sorry :(")
}
