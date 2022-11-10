import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { FiCommand, FiX } from "react-icons/fi"

import "../../styles/entrypoint.css"
import { getSession } from "../../utils/auth";
import EntrypointActions from "./EntrypointActions";
import EntrypointPartners from "./EntrypointPartners";
import EntrypointCountdown from "./EntrypointCountdown";
import PublicView from "./PublicView";
import NotFound from "../../NotFound";

export enum ENTRYPOINT_STATUS {
    EntrypointPending = "pending",
    EntrypointCompleted = "completed",
    EntrypointOpen = "open",
}

export enum PARTNER_STATUS {
    PartnerNone = "none",
    PartnerPartial = "partial",
    PartnerFull = "full",
}

export interface IUser {
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
    const params = useParams()
    const hasData = useRef(false)
    const navigate = useNavigate()
    const session = getSession()
    const [data, setData] = useState(props.data as IEntrypoint)
    const [isOwned, setOwned] = useState(false)

    useEffect(() => {
        if(data === undefined)
            return
        // checking if current user is an owner of the entrypoint
        if (data.users.length > 0 && session.user.uuid !== "")
            for (let u of data.users)
                if (u.uuid === session.user.uuid)
                    setOwned(true)
    }, [data, session])

    useEffect(() => {
        const endpoint = new URL(`entrypoints/${params.id}`, process.env.REACT_APP_API_URL)

        async function fetchEntrypoint() {
            const h = new Headers();
            if (session.token !== "")
              h.append("Authorization", `Bearer ${session.token}`);
      
            var options = {
              method: 'GET',
              headers: h
            };
            const res = await fetch(endpoint, options)
            if (res.ok) {
              const e = await res.json()
              setData(e as IEntrypoint)
            } else {
              console.warn('error', res.status)
            }
          }
      
          if (hasData.current === false) {
            fetchEntrypoint()
            hasData.current = true
          }
    }, [params.id])

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
        } else {
            console.warn('error', res.status)
        }
    }

    const completeModule = async (data: any, session: any) => {
        const endpoint = new URL(`entrypoints/${data.uuid}/progress`, process.env.REACT_APP_API_URL)

        if (session.token === "")
            Navigate({ to: "/auth" })

        const h = new Headers();
        h.append("Authorization", `Bearer ${session.token}`);

        var options = {
            method: 'PATCH',
            headers: h
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
                        <iframe title={data.media.type + "title"} src={data.media.url} width="640" height="360"></iframe>
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
            mods.push(<button key="complete-module" className="border-2 border-amber-800 rounded-md p-2" onClick={() => completeModule(data, session)}>complete module</button>)

        return mods
    }



    const getCountdown = (): string => {
        var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();
        // Get today's date and time
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);


        var result: string = ""
        result += (days + " : ")
        result += (hours + " : ")
        result += (minutes + " : ")
        result += (seconds)
        return (result)
    }    

    if(data !== undefined)
        return (
        <div className="absolute w-full h-full p-4 md:w-[720px]">
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
                            <FiCommand className="text-[32px]" />
                            <h1>{data.name}</h1>
                        </div>
                        <div className="cursor-pointer"
                            onClick={() => navigate('/', {replace: true})}>
                            <FiX className="text-[32px]" />
                        </div>
                    </div>
                </div>
                <EntrypointCountdown endDate="Jan 5, 2024 15:37:25" />
                <EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
                <div className="w-full h-full">
                    {
                        isOwned ?
                            getModules()
                            : data.users.length < data.max_users ? <>
                                {parseModule(data.modules[0])}
                            </> :
                                <>
                                    <PublicView entrypoint={data} />
                                </>
                    }
                </div>
                <div className="h-12
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-amber-800">
                    <EntrypointActions
                        status={data.status}
                        users={data.users}
                        isOwner={isOwned}
                        lastStepIndex={data.modules.length}
                        currentStepIndex={data.current_module}
                        claimEntryPoint={claimEntrypoint}
                    />
                </div>
            </div>

        </div>
    )

    return(<NotFound/>) //-- if data is not defined, it means we're still fetching it from the backend (so this should be a spinner instead)
}

export default Entrypoint