import L from "leaflet";
import { Marker } from "react-leaflet"
import { useNavigate } from "react-router-dom";
import { IEntrypoint } from "../../utils/types";

const EntrypointMarker = (props: any) => {
    const navigate = useNavigate()
    const ep = props.data as IEntrypoint
    
    const icon = new L.Icon({
        iconUrl: require(`../../assets/markers/${ep.icon}`),
        iconSize: [36, 36],
    })

    return (
        <Marker
            position={[ep.lat, ep.lng]}
            key={`marker-${ep.name}`}
            icon={icon}
            eventHandlers={{
                click: (e) => { navigate(`/entrypoints/${ep.uuid}`, {replace: true}) },
            }}>
        </Marker>
    )
}

export default EntrypointMarker