import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ImageOverlay, MapContainer, Marker, Popup } from 'react-leaflet'
import { CRS, LeafletMouseEvent } from 'leaflet';
import L from "leaflet";

import { getSession, signout } from './utils/auth'
import Auth from './components/auth/Auth'
import EntrypointMarker from './components/EntrypointMarker';
import Entrypoint from './components/Entrypoint';

import backgroundMap from './map.png'

interface EntrypointInterface {
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

  const handleEntrypointSelect = (ep: EntrypointInterface) => {
    setCurrentEntrypoint(ep)
  }

  const handleEntrypointClose = () => {
    setCurrentEntrypoint({} as EntrypointInterface)
  }

  return (
    <div className="App">
      {session.token === '' ?
        <Auth />
        :
        <>
          <div className="map-container" id="map">
            <MapContainer center={[WIDTH/2, HEIGHT/2]} minZoom={MIN_ZOOOM} maxZoom={MAX_ZOOM} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
              <ImageOverlay url={backgroundMap} bounds={bounds} />
              <>
                {entrypoints.map(ep => {
                  return (
                    <EntrypointMarker
                      key={`ep-${ep.name}`}
                      data={ep}
                      onSelect={handleEntrypointSelect} />
                  )
                })
                }
              </>
            </MapContainer>
          </div>
          <>
            {
              Object.keys(currentEntrypoint).length > 0 ?
                <Entrypoint onClose={handleEntrypointClose} data={currentEntrypoint}/>
                :
                <></>
            }
          </>
          <div className="menu">
            <div>hi {session.user.name}</div>
            <button onClick={signout}>sign out</button>
          </div>
        </>
      }
    </div>
  );
}

export default App;
