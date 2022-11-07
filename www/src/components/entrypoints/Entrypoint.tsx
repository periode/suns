import { Draggable } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import {FiCommand, FiX } from "react-icons/fi"

import "../../styles/entrypoint.css"
import { getSession } from "../../utils/auth";

interface IUser {
    name: string,
    uuid: string,
}

interface IEntrypoint {
    uuid: String,
    name: String,
    status: String,
    content: String,
    current_module: number,
    status_module: String,
    modules: [{
        name: String,
        content: String
    }],
    users: Array<IUser>
    max_users: number
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
            //-- todo here pares the response to assess the status of the entrypoint (open, pending)
            const updated = await res.json()
            setData({ ...data, current_module: updated.current_module, status_module: updated.status_module })
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

    const getPartners = () => {
        if (data.users.length === 0) { //-- no owners
            return (<div>No users! <button onClick={claimEntrypoint}>claim</button></div>)
        } else if (data.users.length < data.max_users) { //-- partial owners
            return (<div>Owned by {data.users[0].uuid === session.user.uuid ? "you" : data.users[0].name}, and waiting for another partner. {!isOwned ? <button onClick={claimEntrypoint}>claim</button> : <></>}</div>)
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
        <div className=" absolute z-100
                        flex flex-col
                        w-full h-full m-4
                        border border-amber-800
                        text-amber-800
                        bg-amber-50
                        ">
            <div className="w-full flex justify-between 
                            p-4
                            border-b border-amber-800">
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-4">
                        <FiCommand className="text-2xl"/>
                        <h1>{data.name}</h1>
                    </div>
                    <button onClick={props.onClose}>
                        <FiX className="text-2xl"/>
                    </button>
                </div>
            </div>
            {getPartners()}
            <hr />
            {isOwned ?
                getModules()
                :
                <>
                    <div>here goes the public view (the current view is at {data.current_module})</div>
                </>}
            <hr />
        </div>
    </div>
    )
}

export default Entrypoint