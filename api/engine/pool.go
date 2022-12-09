package engine

import (
	"fmt"
	"math/rand"
	"os"
	"path/filepath"

	zero "github.com/periode/suns/api/logger"
	"github.com/periode/suns/api/models"
	"gopkg.in/yaml.v2"
)

var fixtures = [5]string{"first_times", "cracks", "draught", "footprints", "symbiosis"}

type Pool struct {
	entrypoints []models.Entrypoint
}

func (p *Pool) Generate() error {
	for _, f := range fixtures {
		bytes, err := os.ReadFile(filepath.Join(Basepath, "../models/fixtures/clusters", fmt.Sprintf("%s.yml", f)))
		if err != nil {
			return err
		}

		var new models.Cluster
		err = yaml.Unmarshal(bytes, &new)
		if err != nil {
			return err
		}

		p.entrypoints = append(p.entrypoints, new.Entrypoints...)
	}

	zero.Debugf("engine generated entrypoints: %d", len(p.entrypoints))

	return nil
}

func (p *Pool) Pick(num int) []models.Entrypoint {
	var res []models.Entrypoint
	for i := 0; i < num; i++ {
		ep := p.entrypoints[rand.Intn(len(p.entrypoints))]
		ep.Generation = state.generation
		res = append(res, ep)
	}
	return res
}
