import { useEffect, useRef, useState } from 'react';
import { ImageOverlay, MapContainer, Marker } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

import { getSession } from './utils/auth'
import EntrypointMarker from './components/entrypoints/EntrypointMarker';
import cracksMarker from "./assets/markers/cracks.svg"
import Entrypoint from './components/entrypoints/Entrypoint';

import MainMenu from './components/commons/menu/MainMenu';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import UILayout from './components/commons/layout/UILayout';
import AirContext from './contexts/AirContext';

import { IEntrypoint } from './utils/types';
import Cracks from './pages/archives/Cracks';
import Sacrifice from './pages/archives/Sacrifice';

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
const backgroundMap = "https://map.joiningsuns.online/map.png?refresh"
const { noise } = require('@chriscourses/perlin-noise')

const App = () => {
  var currentEntrypoint: IEntrypoint = {} as IEntrypoint
  const hasData = useRef(false)
  const hasState = useRef(false)
  const navigate = useNavigate()
  const step = useRef(0)
  const [entrypoints, setEntrypoints] = useState(Array<IEntrypoint>)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(WIDTH, HEIGHT))
  const session = getSession()
  const [cracksCoords, setCracksCoords] = useState(new L.LatLng(500, 500))
  const cracksIcon = new L.Icon({
    iconUrl: cracksMarker,
    iconSize: [36, 36],
  })

  useEffect(() => {
    const endpoint = new URL('engine/state', process.env.REACT_APP_API_URL)



    if (hasState.current === false) {
      hasState.current = true;
      fetch(endpoint)
        .then(res => {
          if (res.ok)
            return res.json()
          else
            console.warn("GET engine state:", res.statusText)
        })
        .then(data => {
          console.log(`current state:\n- generation: ${data.generation}\n- number of sacrifices: ${data.sacrifice_wave}`)
        })
    }
  }, [])

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


  const moveCracks = () => {
    const x = noise(step.current)
    const y = noise(step.current + 0.1)
    step.current += 0.001
    setCracksCoords(new L.LatLng(x * WIDTH, y * HEIGHT));
  }

  useEffect(() => {
    setInterval(moveCracks, 1000)
  }, [])

  return (

    <AirContext>
      <div className="App w-full h-full font-serif">
        {session.token === '' ?
          <Navigate to="/auth" />
          :
          <>
            <MainMenu username={session.user.name} markURL={session.user.mark_url} />
            <div className="map-container" id="map">
              <MapContainer center={[WIDTH / 2, HEIGHT / 2]} minZoom={MIN_ZOOOM} maxZoom={MAX_ZOOM} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
                <ImageOverlay url={backgroundMap} bounds={bounds} />
                <>
                  {entrypoints.map((ep, index) => {
                    if (ep.visibility == "visible") {
                      return (
                        <EntrypointMarker
                          key={`ep-${ep.name.replace(' ', '-')}-${index}-${ep.uuid}`}
                          data={ep}
                        />
                      )
                    } else {
                      return (<></>)
                    }
                  })
                  }
                </>
                <Marker
                  position={cracksCoords}
                  key={`marker-cracks`}
                  icon={cracksIcon}
                  eventHandlers={{
                    click: () => { navigate(`/entrypoints/archive/cracks`, { replace: true }) },
                  }}>
                </Marker>
              </MapContainer>
            </div>
            <Routes>
              <Route path=":id" element={<Entrypoint />} />
              <Route path="archive/cracks" element={<Cracks />} />
              <Route path="archive/sacrifice" element={<Sacrifice />} />
            </Routes>
            <UILayout currentEntrypoint={currentEntrypoint} />
          </>
        }
      </div>
    </AirContext>
  );
}

export default App;
