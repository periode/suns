import L from "leaflet";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet"
import { useNavigate } from "react-router-dom";
import { ENTRYPOINT_STATUS, IEntrypoint } from "../../utils/types";

const EntrypointMarker = (props: any) => {
    const navigate = useNavigate()
    const session = props.session
    const ep = props.ep as IEntrypoint
    const htmlIcon = ReactDOMServer.renderToString(<img src={require(`../../assets/markers/${ep.icon}`)} />)
    const [icon, setIcon] = useState<L.DivIcon>(new L.DivIcon({
        html: htmlIcon,
        iconSize: [80, 80],
        className: `stone-500 flex rounded-full p-1`,
    }))

    useEffect(() => {
        if(ep.status !==ENTRYPOINT_STATUS.EntrypointCompleted && ep.users.length === 1 && session.user.uuid === ep.users[0].uuid){
            setIcon(new L.DivIcon({
                html: htmlIcon,
                iconSize: [80, 80],
                className: `bg-amber-500 flex rounded-full p-1`,
            }))
            return
        }

        if(ep.status !==ENTRYPOINT_STATUS.EntrypointCompleted && ep.users.length === 2 && (session.user.uuid === ep.users[0].uuid || session.user.uuid === ep.users[1].uuid)){
            setIcon(new L.DivIcon({
                html: htmlIcon,
                iconSize: [80, 80],
                className: `bg-amber-500 flex rounded-full p-1`,
            }))
            return
        }

        switch (ep.status) {
            case ENTRYPOINT_STATUS.EntrypointOpen:
                setIcon(new L.DivIcon({
                    html: htmlIcon,
                    iconSize: [80, 80],
                    className: `bg-amber-900 flex rounded-full p-1`,
                }))
                break;
            case ENTRYPOINT_STATUS.EntrypointCompleted:
                setIcon(new L.DivIcon({
                    html: htmlIcon,
                    iconSize: [80, 80],
                    className: `bg-green-500 flex rounded-full p-1`,
                }))
                break;
            case ENTRYPOINT_STATUS.EntrypointPending:
                setIcon(new L.DivIcon({
                    html: htmlIcon,
                    iconSize: [80, 80],
                    className: `bg-stone-500 flex rounded-full p-1`,
                }))
                break;
            default:
                break;
        }
    }, [ep])

    return (
        <Marker
            position={[ep.lat, ep.lng]}
            key={`marker-${ep.name}`}
            icon={icon}
            eventHandlers={{
                click: (e) => { navigate(`/entrypoints/${ep.uuid}`, { replace: true }) },
            }}>
        </Marker>
    )
}

export default EntrypointMarker