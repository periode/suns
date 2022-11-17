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

	//-- attach new entrypoints to map clusters
	//-- easiest is to read from fixtures
	for _, f := range fixtures {
		bytes, err := os.ReadFile(filepath.Join(Basepath, "../models/fixtures/entrypoints", fmt.Sprintf("%s.yml", f)))
		if err != nil {
			return err
		}

		new := make([]models.Entrypoint, 0)
		err = yaml.Unmarshal(bytes, &new)
		if err != nil {
			return err
		}

		//-- randomized position could happen in models BeforeCreate
		for i, _ := range new {
			new[i].Lat = rand.Float32() * 900
			new[i].Lng = rand.Float32() * 900
		}

		p.entrypoints = append(p.entrypoints, new...)
	}

	zero.Debugf("Picked up entrypoints: %d", len(p.entrypoints))

	return nil
}

func (p *Pool) Pick() []models.Entrypoint {
	var res []models.Entrypoint
	res = append(res, p.entrypoints[rand.Intn(len(p.entrypoints))])
	return res
}
