import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {FiCommand, FiX } from "react-icons/fi"

import "../../styles/entrypoint.css"
import { getSession } from "../../utils/auth";
import EntrypointActions from "./EntrypointActions";

enum ENTRYPOINT_STATUS {
    EntrypointPending   = "pending",
    EntrypointCompleted = "completed",
    EntrypointOpen      = "open",
}

enum PARTNER_STATUS {
    PartnerNone     = "none",
    PartnerPartial  = "partial",
    PartnerFull     = "full",
}

interface IUser {
    name: string,
    uuid: string,
}

interface IEntrypoint {
    uuid: String,
    name: String,
    status: ENTRYPOINT_STATUS,
    content: String,
    current_module: number,
    status_module: String,
    modules: [{
        name: String,
        content: String,
        type: String,
        media: Object,
        uploads: Array<Object>
    }],
    users: Array<IUser>
    max_users: number
    partner_status: PARTNER_STATUS
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

    const completeModule = async (data: any, session : any) => {
        const current = (data.current_module + 1)
        const endpoint = new URL(`entrypoints/${data.uuid}/progress`, process.env.REACT_APP_API_URL)
    
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
            //-- todo here parse the response to assess the status of the entrypoint (open, pending)
            const updated = await res.json()
            setData({ ...data, current_module: updated.current_module, status_module: updated.status_module })
        } else {
            console.warn('error', res.status)
        }
    }

    const parseModule = (data: any) => {
        return (
            <div key={`mod-${data.name}`}>
                <h3>{data.name}</h3>
                <p>
                    {data.content}
                </p>
                {data.media ?
                    data.media.type === "video" ?
                        <iframe src={data.media.url} width="640" height="360" frameBorder="0"></iframe>
                        : <audio src={data.media.url}></audio>
                    : <></>
                }
            </div>
        )
    }

    const getModules = () => {
        let mods = []
        for (let i = 0; i <= data.current_module; i++) {
            const m = data.modules[i]
            mods.push(parseModule(m))
        }
    
        if (data.current_module < data.modules.length - 1)
            mods.push(<button onClick={() => completeModule(data, session)}>complete module</button>)
    
        return mods
    }

    const updatePartners = () {
        if ()
    }

    const getPartners = () => {
        if (data.users.length === 0) { //-- no owners
            return (<>
                <div className="m-2">No users!</div>
                <div>
                    <button className="rounded-lg bg-white p-2 border-black border-2" onClick={claimEntrypoint}>claim</button>
                </div>
            </>)
        } else if (data.users.length < data.max_users) { //-- partial owners
            return (<>
                <div>Owned by {data.users[0].uuid === session.user.uuid ? "you" : data.users[0].name}, and waiting for another partner. {!isOwned ?
                    <div>
                        <button onClick={claimEntrypoint}>claim</button>
                    </div> : <></>}</div>
            </>)
        } else if (data.users.length == data.max_users) { //-- full session
            if (data.max_users === 2)
                return (<div>Owned by {data.users[0].uuid === session.user.uuid ? `you and ${data.users[1].name}` : data.users[1].uuid === session.user.uuid ? `${data.users[0].name} and you` : `${data.users[0].name} and ${data.users[1].name}`}</div>)
            else if (data.max_users === 1)
                return (<div>Owned by {data.users[0].uuid === session.user.uuid ? `you` : data.users[0].name}</div>)
        } else {
            return (<div>Not sure what happened</div>)
        }
    }

    return (
    <div className="absolute w-full h-full p-4">
        <div className="
                        flex flex-col
                        w-full h-full 
                        border border-amber-800
                        text-amber-800
                        bg-amber-50
                        ">
            <div className="w-full flex justify-between 
                            p-4
                            border-b border-amber-800">
                <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FiCommand className="text-[32px]"/>
                        <h1>{data.name}</h1>
                    </div>
                    <div    className="cursor-pointer"
                            onClick={props.onClose}>
                        <FiX className="text-[32px]"/>
                    </div>
                </div>
            </div>
            <div className="w-full h-12 
                            flex items-center justify-center
                            font-mono
                            border-b border-amber-800
                            ">
                <p>00 : 00 : 00</p>
            </div>
            <div className="w-full h-12 
                            flex items-center justify-center
                            font-mono
                            border-b border-amber-800
                            ">
                { getPartners() }
            </div>
            <div className="w-full h-full">
                {
                    isOwned ?
                        getModules()
                        : data.users.length < data.max_users ? <>
                            {parseModule(data.modules[0])}
                        </> :
                            <>
                                <div>here goes the public view (the current view is at {data.current_module})</div>
                            </>
                }
            </div>
            <div className="h-12
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-amber-800">
                <EntrypointActions 
                    status={ data.status }
                    users={ data.users }
                    isOwner={ isOwned }
                    lastStepIndex={ data.modules.length }
                    currentStepIndex={ data.current_module }
                    claimEntryPoint={ claimEntrypoint }
                />
            </div>
        </div>
    </div>
    )
}

export default Entrypoint

export { ENTRYPOINT_STATUS }