import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import "../styles/entrypoint.css"
import { getSession } from "../utils/auth";

interface IEntrypoint {
    uuid: String,
    name: String,
    status: String,
    content: String,
    current_module: number,
    modules: [{
        name: String,
        content: String
    }],
    users: [{
        uuid: String,
        name: String
    }]
}

const Entrypoint = (props: any) => {
    const session = getSession()
    const [data, setData] = useState(props.data as IEntrypoint)
    const [isClaimed, setClaimed] = useState(data.users.length > 0)
    const [isOwned, setOwned] = useState(false)

    useEffect(() => {
        if (data.users.length > 0 && session.user.uuid !== "")
            for (let u of data.users)
                if (u.uuid === session.user.uuid)
                    setOwned(true)
    }, [data, session])

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
        b.append("current_module", current.toString())

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

        if (data.current_module < data.modules.length - 1)
            mods.push(<button onClick={completeModule}>complete module</button>)

        return mods
    }

    return (
        <div className="current-entrypoint">
            <h1>{data.name}</h1>
            {isClaimed ?
                isOwned ?
                    <>Owned by you</>
                    :
                    <>Owned by {data.users[0].name}</>
                :
                <button onClick={claimEntrypoint}>claim</button>
            }
            <hr />
            {isOwned ? getModules() : <></>}
            <hr />
            <button onClick={props.onClose}>close</button>
        </div>
    )
}

export default Entrypoint