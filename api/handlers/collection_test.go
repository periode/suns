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

func TestCollectionHandler(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed collections", func(t *testing.T) {
		os.Setenv("API_MODE", "debug")
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")
		handlers.GetAllCollections(c)
		assert.Equal(t, http.StatusOK, res.Code)

		colls := make([]models.Collection, 0)
		err := json.Unmarshal(res.Body.Bytes(), &colls)
		require.Nil(t, err)
		assert.Equal(t, 2, len(colls))
		os.Setenv("API_MODE", "test")
	})

	t.Run("Test get all listed and owned collections", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")
		handlers.GetAllCollections(c)
		assert.Equal(t, http.StatusOK, res.Code)

		colls := make([]models.Collection, 0)
		err := json.Unmarshal(res.Body.Bytes(), &colls)
		require.Nil(t, err)
		assert.Equal(t, 3, len(colls))
	})

	t.Run("Test create collection", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test Collection Handling")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")

		handlers.CreateCollection(c)

		assert.Equal(t, http.StatusCreated, res.Code)

		var coll models.Collection
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, "Test Collection Handling", coll.Name)
		assert.NotZero(t, coll.CreatedAt)
	})

	t.Run("Test create collection malformed input", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Test")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/collections", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")

		handlers.CreateCollection(c)

		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test get collection", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")
		c.SetParamNames("id")
		c.SetParamValues(collectionID.String())

		handlers.GetCollection(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Collection
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, collectionID, coll.UUID)
		assert.Equal(t, collectionName, coll.Name)
	})

	t.Run("Test get collection by slug", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")
		c.SetParamNames("id")
		c.SetParamValues(collectionSlug)

		handlers.GetCollection(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Collection
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, collectionID, coll.UUID)
		assert.Equal(t, collectionName, coll.Name)
	})

	t.Run("Test get collection non-existing ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/collections")
		c.SetParamNames("id")
		c.SetParamValues(collectionUnknownID.String())

		handlers.GetCollection(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test get collection malformed ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)

		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.GetCollection(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test update collection", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/collections", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues(collectionID.String())

		handlers.UpdateCollection(c)
		assert.Equal(t, http.StatusOK, res.Code)

		var coll models.Collection
		err := json.Unmarshal(res.Body.Bytes(), &coll)
		require.Nil(t, err)
		assert.Equal(t, "Updated", coll.Name)
		assert.NotZero(t, coll.UUID)
		assert.NotZero(t, coll.CreatedAt)
	})

	t.Run("Test update collection non-existing ID", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated Name")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues(collectionUnknownID.String())

		handlers.UpdateCollection(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test update collection malformed ID", func(t *testing.T) {
		f := make(url.Values)
		f.Set("name", "Updated Name")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.UpdateCollection(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test update collection wrong field", func(t *testing.T) {
		f := make(url.Values)
		f.Set("wrong-field", "malicious")

		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPatch, "/", strings.NewReader(f.Encode()))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues(collectionID.String())

		handlers.UpdateCollection(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})

	t.Run("Test delete collection", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues(collectionID.String())

		handlers.DeleteCollection(c)
		assert.Equal(t, http.StatusOK, res.Code)
	})

	t.Run("Test delete collection non-existant ID", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues(collectionUnknownID.String())

		handlers.DeleteCollection(c)
		assert.Equal(t, http.StatusNotFound, res.Code)
	})

	t.Run("Test delete collection wrong input", func(t *testing.T) {
		res := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
		c := echo.New().NewContext(req, res)
		c.SetPath("/collections/:id")
		c.SetParamNames("id")
		c.SetParamValues("wrong")

		handlers.DeleteCollection(c)
		assert.Equal(t, http.StatusBadRequest, res.Code)
	})
}
