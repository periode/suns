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

var weights = make(map[string]int)

func (p *Pool) Generate() error {

	weights = map[string]int{
		"Cracks":              1,
		"DraughtYou":          1,
		"DraughtWorld":        1,
		"DraughtPersonal":     1,
		"CombiningFirstTimes": 1,
		"FootprintsPerson":    1,
		"FootprintsPlace":     1,
		"FootprintsObject":    1,
		"SymbiosisGaze":       1,
		"SymbiosisTask":       1,
		"SymbiosisMean":       1,
	}

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

		//-- add the entrypoint as many times as the name
		for _, ep := range new.Entrypoints {
			for i := 0; i < weights[ep.Name]; i++ {
				p.entrypoints = append(p.entrypoints, ep)
			}
		}

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
