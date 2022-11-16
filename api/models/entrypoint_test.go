package models_test

import (
	"fmt"
	"testing"

	"github.com/periode/suns/api/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEntrypointModel(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed and owned clusters", func(t *testing.T) {
		res, err := models.GetAllEntrypoints(userID)
		require.Nil(t, err)
		assert.Equal(t, len(res), 3)
	})

	t.Run("Test create cluster", func(t *testing.T) {
		cluster := models.Entrypoint{
			Name: "Test Name 2",
		}
		result, err := models.CreateEntrypoint(&cluster)
		require.Nil(t, err)

		assert.Equal(t, cluster.Name, result.Name)
		assert.NotZero(t, cluster.CreatedAt)
	})

	t.Run("Test get cluster", func(t *testing.T) {
		coll, err := models.GetEntrypoint(clusterID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, clusterID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get cluster by slug", func(t *testing.T) {
		coll, err := models.GetEntrypointBySlug(clusterSlug, userID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, clusterID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get non-existing cluster", func(t *testing.T) {
		res, err := models.GetEntrypoint(clusterUnknownID)
		assert.NotNil(t, err)
		assert.True(t, res.CreatedAt.IsZero())
	})

	t.Run("Test update cluster", func(t *testing.T) {
		var coll models.Entrypoint
		updatedName := fmt.Sprintf("%s (updated)", clusterName)
		coll.Name = updatedName
		updated, err := models.UpdateEntrypoint(clusterID, &coll)

		require.Nil(t, err)
		require.False(t, updated.CreatedAt.IsZero())

		assert.Equal(t, updatedName, coll.Name)
		assert.NotEqual(t, updated.CreatedAt, updated.UpdatedAt)
	})

	t.Run("Test update non-existing cluster", func(t *testing.T) {
		coll := models.Entrypoint{
			Name: "Test Name 1 (updated)",
		}
		updated, err := models.UpdateEntrypoint(clusterUnknownID, &coll)
		assert.NotNil(t, err)
		assert.True(t, updated.CreatedAt.IsZero())
	})

	t.Run("Test delete cluster", func(t *testing.T) {
		coll, err := models.DeleteEntrypoint(clusterDeleteID)
		assert.NotNil(t, coll)
		assert.Nil(t, err)
	})

	t.Run("Test delete wrong cluster", func(t *testing.T) {
		coll, err := models.DeleteEntrypoint(clusterUnknownID)
		assert.Zero(t, coll)
		assert.NotNil(t, err)
	})
}
