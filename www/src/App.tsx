import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ImageOverlay, MapContainer, Marker, Popup } from 'react-leaflet'
import { CRS, LeafletMouseEvent } from 'leaflet';
import L from "leaflet";

import { getSession, signout } from './utils/auth'
import Auth from './components/Auth'
import EntrypointMarker from './components/EntrypointMarker';
import Entrypoint from './components/Entrypoint';


interface EntrypointInterface {
  lat: number,
  lng: number,
  name: string,
  modules: [],
}

const App = () => {
  const hasData = useRef(false)
  const [entrypoints, setEntrypoints] = useState(Array<EntrypointInterface>)
  const [currentEntrypoint, setCurrentEntrypoint] = useState({} as EntrypointInterface)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(500, 500))
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
            <MapContainer center={[250, 250]} minZoom={2} maxZoom={8} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
              <ImageOverlay url="https://i.imgur.com/Ion6X7C.jpg" bounds={bounds} />
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
