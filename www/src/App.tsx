import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ImageOverlay, MapContainer } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

import { getSession } from './utils/auth'
import Auth from './components/auth/Auth'
import EntrypointMarker from './components/entrypoints/EntrypointMarker';
import Entrypoint from './components/entrypoints/Entrypoint';

import backgroundMap from './map.png'
import MainMenu from './components/commons/menu/MainMenu';
import { Route, Routes } from 'react-router-dom';

interface EntrypointInterface {
  uuid: string
  lat: number,
  lng: number,
  name: string,
  modules: [],
  max_users: number
}

const WIDTH = 1000;
const HEIGHT = 1000;
const MIN_ZOOOM = 0.5;
const MAX_ZOOM = 6;

const App = () => {
  const hasData = useRef(false)
  const [entrypoints, setEntrypoints] = useState(Array<EntrypointInterface>)
  const [currentEntrypoint, setCurrentEntrypoint] = useState({} as EntrypointInterface)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(WIDTH, HEIGHT))
  const session = getSession()

  useEffect(() => {
    const endpoint = new URL('entrypoints/', process.env.REACT_APP_API_URL)

    async function fetchClusters() {
      const h = new Headers();
      if (session.token !== "")
        h.append("Authorization", `Bearer ${session.token}`);

      var options = {
        method: 'GET',
        headers: h
      };
      const res = await fetch(endpoint, options)
      if (res.ok) {
        const c = await res.json()
        setEntrypoints(c as Array<EntrypointInterface>)
      } else {
        console.warn('error', res.status)
      }
    }

    if (hasData.current === false) {
      fetchClusters()
      hasData.current = true
    }

  }, [session.token])

    return (
      <div className="App">
        {session.token === '' ?
          <Auth />
          :
          <>
            <MainMenu />
            <div className="map-container" id="map">
              <MapContainer center={[WIDTH / 2, HEIGHT / 2]} minZoom={MIN_ZOOOM} maxZoom={MAX_ZOOM} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
                <ImageOverlay url={backgroundMap} bounds={bounds} />
                <>
                  {entrypoints.map(ep => {
                    return (
                      <EntrypointMarker
                        key={`ep-${ep.name}`}
                        data={ep}
                        />
                    )
                  })
                  }
                </>
              </MapContainer>
            </div>
            <Routes>
              <Route path=":id" element={<Entrypoint />} />
            </Routes>
            <>
              {
                Object.keys(currentEntrypoint).length > 0 ?
                  <Entrypoint data={currentEntrypoint} />
                  :
                  <></>
              }
            </>
          </>
        }
      </div>
    );
}

export default App;
