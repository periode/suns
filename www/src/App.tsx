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

import { IEntrypoint } from './utils/types';
import Cracks from './pages/archives/Cracks';
import Sacrifice from './pages/archives/Sacrifice';
import EntrypointNotFound from './components/entrypoints/EntrypointNotFound';

// import Lottie from 'react-lottie' //-- there are multiple react/lottie npm packages (react-lottie, lottie-react, and none of them seem to work)
import Dashboard from './components/dashboard/Dashboard';

const WIDTH = 2500;
const HEIGHT = 2500;
const MIN_ZOOOM = 1;
const MAX_ZOOM = 3;
const { noise } = require('@chriscourses/perlin-noise')

const App = () => {
  var currentEntrypoint: IEntrypoint = {} as IEntrypoint
  const hasData = useRef(false)
  const navigate = useNavigate()
  const step = useRef(0)
  const [entrypoints, setEntrypoints] = useState(Array<IEntrypoint>)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(WIDTH, HEIGHT))
  const session = getSession()
  const [cracksCoords, setCracksCoords] = useState(new L.LatLng(500, 500))
  const [backgroundMap, setBackgroundMap] = useState("https://map.joiningsuns.online/map.png?refresh")
  const cracksIcon = new L.Icon({
    iconUrl: cracksMarker,
    iconSize: [36, 36],
  })

  // const cracksOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: cracksAnimation,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice"
  //   }
  // };

  // //-- the problem is here: the <Lottie> element disappears when rendered to string
  // const cracksIconElement = ReactDOMServer.renderToString(<div className="backgroundcircle">
  //   <Lottie options={cracksOptions} width={40} height={40}></Lottie>
  // </div>)

  // const cracksAnimationIcon = L.divIcon({
  //   html: `
  //   <div class = "backgroundcircle">
  //       <lottie-player id="lottieTest" src="./symbiosis1.json" style="width:40px; height: 40px;"></lottie-player>
  //   </div>`,
  //   className: "lottiefuck",
  //   iconSize: [80, 80],
  //   iconAnchor: [12, 40],
  // });

  useEffect(() => {
    const endpoint = new URL('entrypoints/map', process.env.REACT_APP_API_URL)

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
      setBackgroundMap("https://map.joiningsuns.online/map.png?refresh" + Date.now().toString().substring(9))

      hasData.current = true
    }

  }, [session.token])


  const moveCracks = () => {
    const x = noise(step.current)
    const y = noise(step.current + 0.1)
    step.current += 0.0001
    setCracksCoords(new L.LatLng(x * WIDTH, y * HEIGHT));
  }

  useEffect(() => {
    setInterval(moveCracks, 2000)
  }, [])

  return (

    
      <div className="App w-full h-full font-serif">
        {session.token === '' ?
          <Navigate to="/home" />
          :
          <>
            <MainMenu username={session.user.name} markURL={session.user.mark_url} />
            <Dashboard entrypoints={entrypoints} session={session}/>
            <div className="map-container" id="map">
              <MapContainer center={[WIDTH / 2, HEIGHT / 2]} minZoom={MIN_ZOOOM} maxZoom={MAX_ZOOM} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
                <ImageOverlay url={backgroundMap} bounds={bounds} />
                <>
                  {entrypoints.map((ep, index) => {
                    if (ep.visibility === "visible") {
                      return (
                        <EntrypointMarker
                          key={`ep-${ep.name.replace(' ', '-')}-${index}-${ep.uuid}`}
                          ep={ep}
                          session={session}
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
              <Route path="gone" element={<EntrypointNotFound />} />
              <Route path="archive/cracks" element={<Cracks />} />
              <Route path="archive/sacrifice" element={<Sacrifice />} />
            </Routes>
            <UILayout currentEntrypoint={currentEntrypoint} />
          </>
        }
      </div>
    
  );
}

export default App;
