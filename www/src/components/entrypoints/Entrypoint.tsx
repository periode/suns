import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { FiCommand, FiX } from "react-icons/fi"

import "../../styles/entrypoint.css"
import { getSession } from "../../utils/auth";
import EntrypointActions from "./EntrypointActions";
import PublicView from "./PublicView";
import NotFound from "../../NotFound";
import { ENTRYPOINT_STATUS, IEntrypoint, IFile, ISession } from "../../utils/types";
import IntroModule from "../modules/IntroModule";
import TaskModule from "../modules/TaskModule";
import { fetchEntrypoint, progressModule, submitUpload } from "../../utils/entrypoint";
import WaitingModule from "../modules/WaitingModule";
import EntrypointLayout from "./Layouts/EntrypointLayout";
import { Map } from "leaflet";

const FETCH_INTERVAL = 50 * 1000
const ENTRYPOINT_LIFETIME_MINUTES = 72 * 60
const AUTOMATIC_NEXT_DELAY = 3000

const Entrypoint = (props: any) => {

    // Router & navigations infos
    const params = useParams()
    const navigate = useNavigate()

    // Getting Entrypoint data:
    const hasData = useRef(false) // Check if data is fetched
    const session = getSession()

    const [data, setData] = useState(props.data as IEntrypoint)
    const [uploads, setUploads] = useState(Array<IFile>)
    const [endDate, setEndDate] = useState("")
    const [isOwned, setOwned] = useState(false)

    const [canUserComplete, setCanUserComplete] = useState(false)
    const [hasUserCompleted, setUserCompleted] = useState(false)


    //-- gets the initial data
    useEffect(() => {
        if (hasData.current === false) {
            fetchEntrypoint(params.id as string, session.token)
                .then((e: IEntrypoint) => {
                    setData(e as IEntrypoint)

                    let current = e.modules[e.current_module]
                    if (current.type === "intro"
                        || (current.type === "task" && current.tasks[0].type === "prompts_input")
                        || (current.type === "final" && e.current_module < e.modules.length - 1))
                        setCanUserComplete(true)
                })
                .catch(err => {
                    console.error('error', err)
                    // TODO add a modal to explain this entrypoint is gone
                    navigate('/', { replace: true })
                })
            hasData.current = true
        }
    }, [params.id])


    //-- this checks if the user owns the current entrypoint
    //-- and what is the expiry date of the entrypoint
    useEffect(() => {
        // setting entrypoint expiry date
        if (data === undefined)
            return

        //-- checking if current user is an owner of the entrypoint
        //-- and whether they have completed it
        if (data.users.length > 0 && session.user.uuid !== "")
            for (let i = 0; i < data.users.length; i++) {
                const u = data.users[i];

                if (u.uuid === session.user.uuid) {
                    setOwned(true)

                    if (data.user_completed[i] === 1)
                        setUserCompleted(true)
                }
            }

        // setting entrypoint expiry date
        let d = new Date(data.created_at)
        let end = new Date()
        end.setMinutes(d.getMinutes() + ENTRYPOINT_LIFETIME_MINUTES)
        setEndDate(end.toString())

    }, [data, session])

    //-- this listens for whether a user is done with all tasks on the module
    useEffect(() => {
        if (uploads.length === 0) return

        let isDone = true
        for (const u of uploads) {
            if (u.file === undefined && u.text === "") { //-- empty upload
                isDone = false
                break
            }
        }
        setCanUserComplete(isDone)
    }, [uploads])

    //-- this registers ESC to close the modal
    useEffect(() => {
        window.addEventListener('keydown', handleClose)
        return () => {
            window.removeEventListener('keydown', handleClose)
        }
    })

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
            if (updated.max_users > 1)
                setCanUserComplete(false)
        } else {
            console.warn('error', res.status)
        }
    }

    const handleNewUploads = (_new: Array<IFile>) => {
        let tmp = [...uploads]
        for (const n of _new) {
            let hasFound = false
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].uuid === n.uuid) {
                    tmp[i] = n
                    hasFound = true
                    break
                }
            }

            if (!hasFound)
                tmp.push(n)
        }

        setUploads(tmp)
    }

    const handleNext = () => {
        completeModule(data, session)
    }

    const handleClose = (e: KeyboardEvent) => {
        if (e.key === "Escape")
            navigate('/', { replace: true })
    }

    const completeModule = async (ep: IEntrypoint, session: ISession) => {
        if (session.token === "")
            Navigate({ to: "/auth" })


        uploads.forEach(u => {
            console.log(u);

            submitUpload(session.token, data.modules[data.current_module].uuid, u)
                .then(() => {
                    console.log("uploaded file!")
                })
                .catch((err) => console.error(err))
        })

        progressModule(ep.uuid, session.token)
            .then(updated => {
                setUploads([])
                //-- check if we're done with the module
                if (updated.current_module === ep.current_module)
                    setUserCompleted(true) //-- we have a partial state
                else
                    setUserCompleted(false) //-- we move on to the next module

                //-- the edge case is the Welcome module (two users, but should be able to complete)
                if (updated.max_users > 1 && updated.cluster.name !== "Welcome")
                    setCanUserComplete(false)
                else
                    setCanUserComplete(true)

                setData(updated)
            })
            .catch(err => {
                console.log("failed to complete module, status:", err);
            })
    }

    const parseModule = (index: number, ep: IEntrypoint) => {
        const mod = ep.modules[index]

        console.log(ep)

        switch (mod.type) {
            case "intro":
                return (
                    <IntroModule airtable_key={ep.airtable_key} data={mod} />
                )
            case "task":
                return (
                    <TaskModule index={index} ep={ep} data={mod} handleNewUploads={handleNewUploads} setCanUserComplete={setCanUserComplete} />
                )
            case "final":
                return (
                    <PublicView entrypoint={ep} />
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

    const getModule = () => {
        if (data.status === ENTRYPOINT_STATUS.EntrypointCompleted)
            return (<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}-final`} className="m-1 p-1">
                {parseModule(data.current_module, data)}
            </div>)

        if (hasUserCompleted)
            return (<WaitingModule key="module-complete-message" />)

        // Current module
        return (<div
            key={`mod-${data.name.split(' ').join('-')}-${data.current_module}`}
            className="m-1 p-1">{parseModule(data.current_module, data)}
        </div>)
    }

    if (data !== undefined)
        return (
            <div className="absolute z-20 w-full h-full p-4 
                            bg-amber-50/50
                            md:flex md:flex-col md:items-center md:justify-center ">
                <EntrypointLayout
                    owned={isOwned}
                    data={data}
                    session={session}
                    endDate={endDate}
                    title={
                        <div className="w-full flex justify-between flex-col
                                p-4">
                            <div className="w-full  flex justify-between items-center">
                                <div className="full flex items-center gap-4  ">
                                    <FiCommand className="text-[32px]" />
                                    <h1 className="text-xl font-bold">{data.name}</h1>
                                </div>
                                {
                                    (data.cluster.name !== "Welcome" || data.current_module === data.modules.length - 1) ?
                                        <div className="cursor-pointer"
                                            onClick={() => navigate('/', { replace: true })}>
                                            <FiX className="text-[32px]" />
                                        </div> : <></>
                                }
                            </div>
                        </div>
                    }
                    module={
                        <div className="w-full h-full p-4 overflow-scroll">
                            {
                                isOwned || data.status === ENTRYPOINT_STATUS.EntrypointCompleted || data.status === ENTRYPOINT_STATUS.EntrypointOpen ?
                                    getModule()
                                    :
                                    <PublicView entrypoint={data} />
                            }
                        </div>
                    }
                    entrypointactions={
                        <EntrypointActions
                            ep={data}
                            isOwner={isOwned}
                            claimEntryPointFunction={claimEntrypoint}
                            handleNext={handleNext}
                            hasUserCompleted={hasUserCompleted}
                            canUserComplete={canUserComplete}
                        />
                    }
                />
            </div>
        )

    return (<NotFound />) //-- if data is not defined, it means we're still fetching it from the backend (so this should be a spinner instead)
}

export default Entrypoint