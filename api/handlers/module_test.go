package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"

	"encoding/json"

	"github.com/labstack/echo/v4"
	"github.com/periode/suns/api/handlers"
	"github.com/periode/suns/api/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestModuleHandler(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed clusters", func(t *testing.T) {
		os.Setenv("API_MODE", "debug")
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		handlers.GetAllModules(c)
		assert.Equal(t, http.StatusOK, res.Code)

		entries := make([]models.Module, 0)
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, 2, len(entries))
		os.Setenv("API_MODE", "test")
	})

	t.Run("Test get all listed and owned clusters", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		handlers.GetAllModules(c)
		assert.Equal(t, http.StatusOK, res.Code)

		entries := make([]models.Module, 0)
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, 3, len(entries))
	})

	t.Run("Test create cluster", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test Module Handling")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")

		handlers.CreateModule(c)

		assert.Equal(t, http.StatusCreated, res.Code)

		var entries models.Module
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, "Test Module Handling", entries.Name)
		assert.NotZero(t, entries.CreatedAt)
	})

	t.Run("Test create cluster malformed input", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/clusters", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")

		handlers.CreateModule(c)

		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test get cluster", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterID.String())

		handlers.GetModule(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var entries models.Module
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, clusterID, entries.UUID)
		assert.Equal(t, clusterName, entries.Name)
	})

	t.Run("Test get cluster by slug", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterSlug)

		handlers.GetModule(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var entries models.Module
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, clusterID, entries.UUID)
		assert.Equal(t, clusterName, entries.Name)
	})

	t.Run("Test get cluster non-existing ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterUnknownID.String())

		handlers.GetModule(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test get cluster malformed ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.GetModule(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test update cluster", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/clusters", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues(clusterID.String())

		handlers.UpdateModule(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var entries models.Module
		err := json.Unmarshal(res.Body.Bytes(), &entries)
		require.Nil(t, err)
		assert.Equal(t, "Updated", entries.Name)
		assert.NotZero(t, entries.UUID)
		assert.NotZero(t, entries.CreatedAt)
	})

	t.Run("Test update cluster non-existing ID", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated Name")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues(clusterUnknownID.String())

		handlers.UpdateModule(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test update cluster malformed ID", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated Name")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.UpdateModule(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test update cluster wrong field", func(t *testing.T) {
		f := make(url.Values)
		f.Set("wrong-field", "malicious")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues(clusterID.String())

		handlers.UpdateModule(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test delete cluster", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues(clusterID.String())

		handlers.DeleteModule(c)
		assert.Equal(t, http.StatusOK, res.Code)
	})

	t.Run("Test delete cluster non-existant ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues(clusterUnknownID.String())

		handlers.DeleteModule(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test delete cluster wrong input", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.DeleteModule(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})
}
