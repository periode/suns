import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import "../styles/entrypoint.css"
import { getSession } from "../utils/auth";

interface IModule {
    name: String,
    status: String,
    content: String
}

const Entrypoint = (props: any) => {
    const session = getSession()
    const [data, setData] = useState(props.data)
    const [isClaimed, setClaimed] = useState(data.users.length > 0)

    const claimEntrypoint = async () => {
        const endpoint = new URL(`entrypoints/${data.uuid}/claim`, process.env.REACT_APP_API_URL)

        if (session.token === "")
            Navigate({ to: "/auth" })

        const h = new Headers();
        h.append("Authorization", `Bearer ${session.token}`);

        var options = {
            method: 'PATCH',
            headers: h,
            body: session.user.uuid
        };
        const res = await fetch(endpoint, options)
        if (res.ok) {
            console.log(`successfully claimed entrypoint!`);
            const updated = await res.json()
            setData(updated)
            setClaimed(true)
        } else {
            console.warn('error', res.status)
        }
    }

    const completeModule = async () => {
        const current = (data.current_module + 1)
        const endpoint = new URL(`entrypoints/${data.uuid}`, process.env.REACT_APP_API_URL)

        if (session.token === "")
            Navigate({ to: "/auth" })

        const h = new Headers();
        h.append("Authorization", `Bearer ${session.token}`);

        const b = new FormData()
        b.append("current_module", current)

        var options = {
            method: 'PATCH',
            headers: h,
            body: b
        };
        const res = await fetch(endpoint, options)
        if (res.ok) {
            console.log(`successfully completed entrypoint!`);
            const updated = await res.json()
            setData({ ...data, current_module: current })
        } else {
            console.warn('error', res.status)
        }
    }

    const getModules = () => {
        let mods = []
        for (let i = 0; i <= data.current_module; i++) {
            const m = data.modules[i]
            mods.push(<div key={`mod-${m.name}`}>{m.content}</div>)
        }

        return mods
    }

    return (
        <div className="current-entrypoint">
            <h1>{data.name}</h1>
            {isClaimed ?
                <>Owned by {data.users[0].name}</>
                :
                <button onClick={claimEntrypoint}>claim</button>
            }
            <hr />
            {getModules()}
            {
                data.current_module < data.modules.length-1 ?
                    <button onClick={completeModule}>complete module</button>
                    :
                    <></>
            }

            <hr />
            <button onClick={props.onClose}>close</button>
        </div>
    )
}

export default Entrypoint