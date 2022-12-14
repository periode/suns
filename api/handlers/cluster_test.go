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

func TestClusterHandler(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed clusters", func(t *testing.T) {
		os.Setenv("API_MODE", "debug")
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		handlers.GetAllClusters(c)
		assert.Equal(t, http.StatusOK, res.Code)

		colls := make([]models.Cluster, 0)
		err := json.Unmarshal(res.Body.Bytes(), &colls)
		require.Nil(t, err)
		assert.Equal(t, 2, len(colls))
		os.Setenv("API_MODE", "test")
	})

	t.Run("Test get all listed and owned clusters", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		handlers.GetAllClusters(c)
		assert.Equal(t, http.StatusOK, res.Code)

		colls := make([]models.Cluster, 0)
		err := json.Unmarshal(res.Body.Bytes(), &colls)
		require.Nil(t, err)
		assert.Equal(t, 3, len(colls))
	})

	t.Run("Test create cluster", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test Cluster Handling")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")

		handlers.CreateCluster(c)

		assert.Equal(t, http.StatusCreated, res.Code)

		var coll models.Cluster
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, "Test Cluster Handling", coll.Name)
		assert.NotZero(t, coll.CreatedAt)
	})

	t.Run("Test create cluster malformed input", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/clusters", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")

		handlers.CreateCluster(c)

		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test get cluster", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterID.String())

		handlers.GetCluster(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Cluster
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, clusterID, coll.UUID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get cluster by slug", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterSlug)

		handlers.GetCluster(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Cluster
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, clusterID, coll.UUID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get cluster non-existing ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters")
		c.SetParamNames("id")
		c.SetParamValues(clusterUnknownID.String())

		handlers.GetCluster(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test get cluster malformed ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/clusters/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.GetCluster(c)
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

		handlers.UpdateCluster(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Cluster
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, "Updated", coll.Name)
		assert.NotZero(t, coll.UUID)
		assert.NotZero(t, coll.CreatedAt)
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

		handlers.UpdateCluster(c)
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

		handlers.UpdateCluster(c)
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

		handlers.UpdateCluster(c)
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

		handlers.DeleteCluster(c)
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

		handlers.DeleteCluster(c)
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

		handlers.DeleteCluster(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})
}
