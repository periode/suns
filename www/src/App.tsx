import React, { useEffect, useState } from 'react';
import './App.css';
import { ImageOverlay, MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

interface ClusterInterface {
  lat: number,
  lng: number,
  name: string,
}

const App = () => {
  const [clusters, setClusters] = useState(Array<ClusterInterface>)
  const bounds = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(500, 500))

  useEffect(() => {
    async function fetchClusters() {
      const res = await fetch("http://localhost:3046/clusters/")
      if (res.ok) {
        const c = await res.json()
        setClusters(c as Array<ClusterInterface>)
      } else {
        console.warn('error', res.status)
      }
    }
    fetchClusters()
  }, [])

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
