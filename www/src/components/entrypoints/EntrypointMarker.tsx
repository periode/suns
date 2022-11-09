import { Marker } from "react-leaflet"
import { useNavigate } from "react-router-dom";

const EntrypointMarker = (props: any) => {
    const navigate = useNavigate()
    const entrypoint = props.data

    return (
        <Marker
            position={[entrypoint.lat, entrypoint.lng]}
            key={`marker-${entrypoint.name}`}
            eventHandlers={{
                click: (e) => { navigate(`/entrypoints/${entrypoint.uuid}`, {replace: true}) },
            }}>
        </Marker>
    )
}

export default EntrypointMarker