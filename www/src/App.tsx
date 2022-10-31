import React, { useEffect, useState } from 'react';
import './App.css';
import { ImageOverlay, MapContainer, Marker, Popup } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

import { getSession, signout } from './utils/auth'
import { Navigate } from 'react-router-dom';

interface ClusterInterface {
  lat: number,
  lng: number,
  name: string,
}

const App = () => {
  const [clusters, setClusters] = useState(Array<ClusterInterface>)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(500, 500))
  var session = getSession()

  useEffect(() => {
    const endpoint = new URL('entrypoints/', process.env.REACT_APP_API_URL)

    async function fetchClusters() {
      const h = new Headers();
      if(session.token !== "")
        h.append("Authorization", `Bearer ${session.token}`);
  
      var options = {
          method: 'GET',
          headers: h
      };
      const res = await fetch(endpoint, options)
      if (res.ok) {
        const c = await res.json()
        setClusters(c as Array<ClusterInterface>)
      } else {
        console.warn('error', res.status)
      }
    }
    fetchClusters()
  }, [session.token])

  return (
    <div className="App">
      {getSession().token === '' ?
        <Navigate to="/auth"/>
        :
        <>
          <div className="map-container" id="map">
            <MapContainer center={[250, 250]} minZoom={2} maxZoom={8} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={bounds} inertia={false}>
              <ImageOverlay url="https://i.imgur.com/Ion6X7C.jpg" bounds={bounds} />
              <>
                {clusters.map(c => {
                  return (
                    <Marker position={[c.lat, c.lng]} key={`marker-${c.name}`}>
                      <Popup>
                        {c.name}
                      </Popup>
                    </Marker>
                  )
                })
                }
              </>
            </MapContainer>
          </div>
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
