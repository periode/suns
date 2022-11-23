import { useEffect, useRef, useState } from 'react';
import { ImageOverlay, MapContainer } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

import { getSession } from './utils/auth'
import EntrypointMarker from './components/entrypoints/EntrypointMarker';
import Entrypoint from './components/entrypoints/Entrypoint';

import backgroundMap from './map.png'
import MainMenu from './components/commons/menu/MainMenu';
import { Navigate, Route, Routes } from 'react-router-dom';
import UILayout from './components/commons/layout/UILayout';
import AirContext from './contexts/AirContext';

import { IEntrypoint } from './utils/types';
import Login from './pages/auth/Login';

export interface EntrypointInterface {
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
  var currentEntrypoint : IEntrypoint = {} as IEntrypoint
  const hasData = useRef(false)
  const [entrypoints, setEntrypoints] = useState(Array<IEntrypoint>)
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
        setEntrypoints(c as Array<IEntrypoint>)
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

        <AirContext>
          <div className="App w-full h-full font-serif">
            { session.token === '' ?
                <Navigate to="/auth"/>
              :
              <>
              <MainMenu username={ session.user.name } />
                <div className="map-container" id="map">
                  <MapContainer center={[WIDTH / 2, HEIGHT / 2]} minZoom={MIN_ZOOOM} maxZoom={MAX_ZOOM} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
                    <ImageOverlay url={backgroundMap} bounds={bounds} />
                    <>
                      {entrypoints.map((ep, index) => {
                        return (
                          <EntrypointMarker
                            key={`ep-${ep.name.replace(' ', '-')}-${index}`}
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
                <UILayout currentEntrypoint={currentEntrypoint}/>
              </>
            }
          </div>
        </AirContext>
    );
}

export default App;
