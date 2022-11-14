import { Marker } from "react-leaflet"
import { useNavigate } from "react-router-dom";
import { IEntrypoint } from "../../utils/types";

const EntrypointMarker = (props: any) => {
    const navigate = useNavigate()
    const ep = props.data as IEntrypoint
    
    return (
        <Marker
            position={[ep.lat, ep.lng]}
            key={`marker-${ep.name}`}
            eventHandlers={{
                click: (e) => { navigate(`/entrypoints/${ep.uuid}`, {replace: true}) },
            }}>
        </Marker>
    )
}

export default EntrypointMarker