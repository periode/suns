package models_test

import (
	"fmt"
	"testing"

	"github.com/periode/suns/api/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestClusterModel(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed and owned clusters", func(t *testing.T) {
		res, err := models.GetAllClusters(userID)
		require.Nil(t, err)
		assert.Equal(t, len(res), 3)
	})

	t.Run("Test create cluster", func(t *testing.T) {
		cluster := models.Cluster{
			Name: "Test Name 2",
		}
		result, err := models.CreateCluster(&cluster)
		require.Nil(t, err)

		assert.Equal(t, cluster.Name, result.Name)
		assert.NotZero(t, cluster.CreatedAt)
	})

	t.Run("Test get cluster", func(t *testing.T) {
		coll, err := models.GetCluster(clusterID, userID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, clusterID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get cluster by slug", func(t *testing.T) {
		coll, err := models.GetClusterBySlug(clusterSlug, userID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, clusterID)
		assert.Equal(t, clusterName, coll.Name)
	})

	t.Run("Test get non-existing cluster", func(t *testing.T) {
		res, err := models.GetCluster(clusterUnknownID, userID)
		assert.NotNil(t, err)
		assert.True(t, res.CreatedAt.IsZero())
	})

	t.Run("Test update cluster", func(t *testing.T) {
		var coll models.Cluster
		updatedName := fmt.Sprintf("%s (updated)", clusterName)
		coll.Name = updatedName
		updated, err := models.UpdateCluster(clusterID, userID, &coll)

		require.Nil(t, err)
		require.False(t, updated.CreatedAt.IsZero())

		assert.Equal(t, updatedName, coll.Name)
		assert.NotEqual(t, updated.CreatedAt, updated.UpdatedAt)
	})

	t.Run("Test update non-existing cluster", func(t *testing.T) {
		coll := models.Cluster{
			Name: "Test Name 1 (updated)",
		}
		updated, err := models.UpdateCluster(clusterUnknownID, userID, &coll)
		assert.NotNil(t, err)
		assert.True(t, updated.CreatedAt.IsZero())
	})

	t.Run("Test delete cluster", func(t *testing.T) {
		coll, err := models.DeleteCluster(clusterDeleteID, userID)
		assert.NotNil(t, coll)
		assert.Nil(t, err)
	})

	t.Run("Test delete wrong cluster", func(t *testing.T) {
		coll, err := models.DeleteCluster(clusterUnknownID, userID)
		assert.Zero(t, coll)
		assert.NotNil(t, err)
	})
}
