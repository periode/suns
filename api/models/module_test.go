package models_test

import (
	"fmt"
	"testing"

	"github.com/periode/suns/api/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestModuleModel(t *testing.T) {
	teardown := setup(t)
	defer teardown(t)

	t.Run("Test get all listed and owned modules", func(t *testing.T) {
		res, err := models.GetAllModules(userID)
		require.Nil(t, err)
		assert.Equal(t, len(res), 3)
	})

	t.Run("Test create module", func(t *testing.T) {
		module := models.Module{
			Name: "Test Name 2",
		}
		result, err := models.CreateModule(&module)
		require.Nil(t, err)

		assert.Equal(t, module.Name, result.Name)
		assert.NotZero(t, module.CreatedAt)
	})

	t.Run("Test get module", func(t *testing.T) {
		coll, err := models.GetModule(moduleID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, moduleID)
		assert.Equal(t, moduleName, coll.Name)
	})

	t.Run("Test get module by slug", func(t *testing.T) {
		coll, err := models.GetModuleBySlug(moduleSlug, userID)
		require.Nil(t, err)
		assert.Equal(t, coll.UUID, moduleID)
		assert.Equal(t, moduleName, coll.Name)
	})

	t.Run("Test get non-existing module", func(t *testing.T) {
		res, err := models.GetModule(moduleUnknownID)
		assert.NotNil(t, err)
		assert.True(t, res.CreatedAt.IsZero())
	})

	t.Run("Test update module", func(t *testing.T) {
		var coll models.Module
		updatedName := fmt.Sprintf("%s (updated)", moduleName)
		coll.Name = updatedName
		updated, err := models.UpdateModule(moduleID, userID, &coll)

		require.Nil(t, err)
		require.False(t, updated.CreatedAt.IsZero())

		assert.Equal(t, updatedName, coll.Name)
		assert.NotEqual(t, updated.CreatedAt, updated.UpdatedAt)
	})

	t.Run("Test update non-existing module", func(t *testing.T) {
		coll := models.Module{
			Name: "Test Name 1 (updated)",
		}
		updated, err := models.UpdateModule(moduleUnknownID, userID, &coll)
		assert.NotNil(t, err)
		assert.True(t, updated.CreatedAt.IsZero())
	})

	t.Run("Test delete module", func(t *testing.T) {
		coll, err := models.DeleteModule(moduleDeleteID, userID)
		assert.NotNil(t, coll)
		assert.Nil(t, err)
	})

	t.Run("Test delete wrong module", func(t *testing.T) {
		coll, err := models.DeleteModule(clusterUnknownID, userID)
		assert.Zero(t, coll)
		assert.NotNil(t, err)
	})
}
