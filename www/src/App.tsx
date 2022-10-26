import React, { useEffect, useRef } from 'react';
import './App.css';
import { ImageOverlay, MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import { CRS } from 'leaflet';
import L from "leaflet";

function App() {
  const b = new L.LatLngBounds(new L.LatLng(0, 0), new L.LatLng(500, 500))
  useEffect(() => {
    console.log(`do API call here`);
  })

  return (
    <div className="App">
      <div className="map-container" id="map">
        <MapContainer center={[250, 250]} minZoom={2} maxZoom={8} zoom={2} scrollWheelZoom={true} crs={CRS.Simple} maxBounds={b} inertia={false}>
          <ImageOverlay url="https://i.imgur.com/Ion6X7C.jpg" bounds={b}/>
          <Marker position={[250, 250]}>
            <Popup>
              Hello.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
