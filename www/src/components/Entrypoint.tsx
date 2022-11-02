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
            setClaimed(true)
            const updated = await res.json()
            setData(updated)
        } else {
            console.warn('error', res.status)
        }
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
            {
                data.modules.map((mod: IModule) => {
                    return (
                        <div key={`mod-${mod.name}`}>{mod.content}</div>
                    )

                })
            }
            <button onClick={props.onClose}>close</button>
        </div>
    )
}

export default Entrypoint