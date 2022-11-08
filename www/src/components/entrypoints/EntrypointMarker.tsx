import { LeafletMouseEvent } from "leaflet"
import { useState } from "react";
import { Marker, Popup } from "react-leaflet"

const EntrypointMarker = (props: any) => {
    const [entrypoint, setEntrypoint] = useState(props.data)    

    const handleMarkerClick = (e: LeafletMouseEvent, mod: any) => {
        props.onSelect(entrypoint)
    }

    return (
        <Marker
            position={[entrypoint.lat, entrypoint.lng]}
            key={`marker-${entrypoint.name}`}
            eventHandlers={{
                click: (e) => { handleMarkerClick(e, entrypoint.modules) },
            }}>
            {/* <Popup>
                {entrypoint.name}
            </Popup> */}
        </Marker>
    )
}

export default EntrypointMarker