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
import FinalFirstTimes from "../modules/FinalFirstTimes";
import { ENTRYPOINT_STATUS, IEntrypoint, IFile, IModule, ISession } from "../../utils/types";
import IntroModule from "../modules/IntroModule";
import TaskModule from "../modules/TaskModule";

const FETCH_INTERVAL = 50 * 1000

const Entrypoint = (props: any) => {
    const params = useParams()
    const hasData = useRef(false)
    const navigate = useNavigate()
    const session = getSession()
    const [data, setData] = useState(props.data as IEntrypoint)
    const [uploads, setUploads] = useState(Array<IFile>)

    const [isOwned, setOwned] = useState(false)
    //-- userDone keeps track of when the user can submit the module
    const [isUserDone, setUserDone] = useState(false)
    //-- userCompleted keeps track of when the module is completed
    const [hasUserCompleted, setUserCompleted] = useState(false)


    useEffect(() => {
        if (data === undefined)
            return
        // checking if current user is an owner of the entrypoint
        if (data.users.length > 0 && session.user.uuid !== "")
            for (let u of data.users)
                if (u.uuid === session.user.uuid)
                    setOwned(true)
    }, [data, session])

    useEffect(() => {
        if (data === undefined)
            return
        // when an entrypoint is owned, we check for the completion status per user
        for (let i = 0; i < data.users.length; i++) {
            const u = data.users[i];
            if (u.uuid === session.user.uuid && data.user_completed[i] === 1) {
                setUserCompleted(true)
                return
            }
        }
    }, [isOwned])

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
                e.modules = e.modules.sort((a: IModule, b: IModule) => { return parseInt(a.ID) - parseInt(b.ID) })

                setData(e as IEntrypoint)
                if (isUserDone) setUserDone(false)
                setTimeout(fetchEntrypoint, FETCH_INTERVAL)
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
            const updated = await res.json()
            setData(updated)
        } else {
            console.warn('error', res.status)
        }
    }

    const submitUploads = async (files: Array<IFile>) => {
        const endpoint = new URL(`uploads/`, process.env.REACT_APP_API_URL)

        if (session.token === "")
            Navigate({ to: "/auth" })

        const h = new Headers();
        h.append("Authorization", `Bearer ${session.token}`);

        const b = new FormData()
        b.append("module_uuid", data.modules[data.current_module].uuid as string)
        if (files[0].file !== undefined)
            b.append("file", files[0].file)
        else
            b.append("text", files[0].text)

        var options = {
            method: 'POST',
            headers: h,
            body: b
        };
        const res = await fetch(endpoint, options)
        if (res.ok)
            console.log('uploaded files');
        else
            console.log(res.statusText)

    }

    const completeModule = async (ep: IEntrypoint, session: ISession) => {
        if (uploads.length > 0)
            submitUploads(uploads)

        const endpoint = new URL(`entrypoints/${ep.uuid}/progress`, process.env.REACT_APP_API_URL)

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
            console.log(`successfully completed module!`);
            const updated = await res.json()

            updated.modules = updated.modules.sort((a: IModule, b: IModule) => { return parseInt(a.ID) - parseInt(b.ID) })

            //-- completion always means the user is done with their input
            setUserDone(false)

            //-- check if we're done with the module
            if (updated.current_module === ep.current_module)
                setUserCompleted(true) //-- we have a partial state
            else
                setUserCompleted(false) //-- we move on to the next module

            setData(updated)
        } else {
            console.warn('error', res.status)
        }
    }

    const parseModule = (index: number, ep: IEntrypoint) => {
        const mod = ep.modules[index]

        switch (mod.type) {
            case "intro":
                return (
                    <IntroModule index={index} epName={ep.name} data={mod} setUserDone={setUserDone} />
                )
            case "task":
                return (
                    <TaskModule index={index} ep={ep} data={mod} setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted} />
                )
            case "final":
                return (
                    <>
                        <div className="absolute text-sm l-0">{index}</div>
                        <p>This is the final module, should be made public</p>
                        <p>
                            {mod.content}
                        </p>
                    </>
                )
            case "final_symbiosis_mean":
                return (
                    <FinalFirstTimes data={ep} />
                )
            case "final_first_times":
                return (
                    <FinalFirstTimes data={ep} />
                )
            default:
                return (
                    <>
                        <div className="absolute text-sm l-0">{index}</div>
                        <p>
                            <b>Could not parse module type!</b>
                        </p>
                    </>
                )
        }
    }

    const getModules = () => {
        let mods = []
        //-- if all modules are displayed and the status of the entrypoint is completed, we return the public view
        if (data.status === ENTRYPOINT_STATUS.EntrypointCompleted) {
            mods.push(<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}-final`} className="m-1 p-1">{parseModule(data.current_module, data)}</div>)

            return mods
        }

        mods.push(<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}`} className="m-1 p-1">{parseModule(data.current_module, data)}</div>)

        if (hasUserCompleted)
            mods.push(<div key="module-complete-message" className="m-1 p-1">You have completed this module! Please wait for your partner to complete it as well.</div>)

        return mods
    }

    if (data !== undefined)
        return (
            <div className="absolute z-20 w-full h-full p-4 
                            md:flex md:flex-col md:items-center md:justify-center ">

                <div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-amber-900 
                        text-amber-900
                        bg-amber-50
                        ">
                    <div className="w-full flex justify-between flex-col
                            p-4
                            border-b border-amber-900">
                        <div className="w-full  flex justify-between items-center">
                            <div className="full flex items-center gap-4  ">
                                <FiCommand className="text-[32px]" />
                                <h1 className="text-xl font-bold">{data.name}</h1>
                            </div>
                            <div className="cursor-pointer"
                                onClick={() => navigate('/', { replace: true })}>
                                <FiX className="text-[32px]" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:flex">
                        <EntrypointCountdown endDate="Jan 5, 2024 15:37:25" />
                        <div className="md:w-[1px] md:h-full  bg-amber-900"></div>
                        <EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
                    </div>
                    <div className="w-full h-full p-4 overflow-scroll">
                        {
                            isOwned || data.status === ENTRYPOINT_STATUS.EntrypointCompleted ?
                                     getModules()
                                : data.users.length < data.max_users ? <>
                                    { parseModule(0, data) }
                                </> :
                                    <>
                                        <PublicView entrypoint={data} />
                                    </>
                        }
                    </div>
                    <div className="h-20
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-amber-900">
                        <EntrypointActions
                            entryPointData={data}
                            session={session}
                            isOwner={isOwned}
                            claimEntryPointFunction={claimEntrypoint}
                            completeModuleFunction={completeModule}
                            hasUserCompleted={hasUserCompleted}
                            isUserDone={isUserDone}
                        />
                    </div>
                </div>
            </div>
        )

    return (<NotFound />) //-- if data is not defined, it means we're still fetching it from the backend (so this should be a spinner instead)
}

export default Entrypoint