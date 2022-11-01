import { useState } from "react";
import { Marker, Popup } from "react-leaflet"

import "../styles/entrypoint.css"

const Entrypoint = (props: any) => {
    const [data, setData] = useState(props.data)
    return (
       <div className="current-entrypoint">
        <h1>{data.name}</h1>
        <button onClick={props.onClose}>close</button>
       </div>
    )
}

export default Entrypoint