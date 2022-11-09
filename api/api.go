package api

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/periode/suns/api/auth"
	"github.com/periode/suns/api/config"
	"github.com/periode/suns/api/handlers"
	zero "github.com/periode/suns/api/logger"
)

var conf config.Config

// StartServer gets his port and debug in the environment, registers the router, and registers the database closing on exit.
func StartServer(port string, c config.Config, engine_chan chan string) {
	conf = c

	err := os.MkdirAll(c.UploadsDir, os.ModePerm)
	if err != nil {
		panic(err)
	}

	router := SetupRouter()
	s := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// from https://gist.github.com/ivan3bx/b0f14449803ce5b0aa72afaa1dfc75e1
	go func() {
		zero.Infof("server starting on port %s", port)
		if err := s.ListenAndServe(); err != http.ErrServerClosed {
			panic(err)
		}
	}()

	shutdown := make(chan os.Signal, 2)
	if os.Getenv("API_MODE") != "test" {
		signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)
	}

	//-- wait for messages from the engine to know what to do
	for {
		time.Sleep(100 * time.Millisecond)

		select {
		case msg := <-engine_chan:
			zero.Debugf("engine event: %s", msg)
		case <-shutdown: // block until signal received
			zero.Info("shutting down...")
			s.Shutdown(context.Background())
			return
		}
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
	r.Use(middleware.BodyLimit("16M"))
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

	users := r.Group("/users")
	{
		users.GET("/", handlers.GetAllUsers)
		users.GET("/:id", handlers.GetUser)
		users.POST("/", handlers.CreateUser)

		users.PATCH("/:id", handlers.UpdateUser)
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
			zero.Warn(err.Error())
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
