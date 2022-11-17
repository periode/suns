import { useCallback, useEffect, useRef, useState } from "react";
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
import { fetchEntrypoint, progressModule, submitUpload } from "../../utils/entrypoint";
import WaitingModule from "../modules/WaitingModule";

const FETCH_INTERVAL = 50 * 1000
const ENTRYPOINT_LIFETIME_MINUTES = 10

const Entrypoint = (props: any) => {
    const params = useParams()
    const hasData = useRef(false)
    const navigate = useNavigate()
    const session = getSession()
    const [data, setData] = useState(props.data as IEntrypoint)
    const [uploads, setUploads] = useState(Array<IFile>)
    const [endDate, setEndDate] = useState("")

    const [isOwned, setOwned] = useState(false)
    const [isRequestingUploads, setRequestingUploads] = useState(false)

    //-- userDone keeps track of when the user can submit the module
    const [isUserDone, setUserDone] = useState(Array<boolean>)

    const [canUserComplete, setCanUserComplete] = useState(false)
    //-- userCompleted keeps track of when the module is completed
    const [hasUserCompleted, setUserCompleted] = useState(false)
    const hasSubmittedModule = useRef(false)

    //-- this checks if the user owns the current entrypoint
    //-- and what is the expiry date of the entrypoint
    useEffect(() => {
        if (data === undefined)
            return
        // checking if current user is an owner of the entrypoint
        if (data.users.length > 0 && session.user.uuid !== "")
            for (let u of data.users)
                if (u.uuid === session.user.uuid)
                    setOwned(true)

        // setting entrypoint expiry date
        let d = new Date(data.created_at)
        let end = new Date()
        end.setMinutes(d.getMinutes() + ENTRYPOINT_LIFETIME_MINUTES)
        setEndDate(end.toString())
    }, [data, session])

    //-- this listens for whether a user is done with all tasks on the module
    useEffect(() => {
        if (data == undefined)
            return

        if (isUserDone.length == data.modules[data.current_module].tasks.length)
            setCanUserComplete(true)

    }, [isUserDone])

    //-- this checks for the completion status per user
    useEffect(() => {
        if (data === undefined)
            return

        for (let i = 0; i < data.users.length; i++) {
            const u = data.users[i];
            if (u.uuid === session.user.uuid && data.user_completed[i] === 1) {
                setUserCompleted(true)
                return
            }
        }
    }, [isOwned])

    //-- this checks if all uploads have been submitted before completing the module
    useEffect(() => {
        if (data === undefined)
            return

        if (uploads.length == data.modules[data.current_module].tasks.length && !hasSubmittedModule.current) {
            completeModule(data, session)
            hasSubmittedModule.current = true
        }
    }, [uploads])

    //-- gets the initial data
    useEffect(() => {
        if (hasData.current === false) {
            fetchEntrypoint(params.id as string, session.token)
                .then((e: IEntrypoint) => {
                    setData(e as IEntrypoint)
                    setUserDone([])
                    setTimeout(fetchEntrypoint, FETCH_INTERVAL)
                })
                .catch(err => {
                    console.warn('error', err)
                    navigate('/')
                })
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

    const handleNewUploads = (_new: Array<IFile>) => {
        setUploads(prev => {
            return [...prev, ..._new] as IFile[]
        })
    }

    const handleUserDone = (_val: boolean) => {
        if (_val == true)
            setUserDone(prev => {
                return [...prev, _val] as boolean[]
            })
    }

    const requestUploads = () => {
        if (data.modules[data.current_module].tasks.length > 0)
            setRequestingUploads(true)
        else
            completeModule(data, session)
    }

    const completeModule = async (ep: IEntrypoint, session: ISession) => {
        if (session.token === "")
            Navigate({ to: "/auth" })


        uploads.forEach(u => {
            submitUpload(session.token, data.modules[data.current_module].uuid, u)
                .then(() => console.log("uploaded file!"))
                .catch((err) => console.log(err))
        })

        progressModule(ep.uuid, session.token)
            .then(updated => {
                //-- completion always means the user is done with their input
                setUserDone([])

                //-- check if we're done with the module
                if (updated.current_module === ep.current_module)
                    setUserCompleted(true) //-- we have a partial state
                else
                    setUserCompleted(false) //-- we move on to the next module

                setData(updated)
            })
            .catch(err => {
                console.log("failed to complete module, status:", err);

            })
    }

    const parseModule = (index: number, ep: IEntrypoint) => {
        const mod = ep.modules[index]

        switch (mod.type) {
            case "intro":
                return (
                    <IntroModule index={index} epName={ep.name} data={mod} handleUserDone={handleUserDone} />
                )
            case "task":
                return (
                    <TaskModule index={index} ep={ep} data={mod} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
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

        //-- if all modules are displayed and the status of the entrypoint is completed, we return the public view
        if (data.status === ENTRYPOINT_STATUS.EntrypointCompleted) {
            return (<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}-final`} className="m-1 p-1">{parseModule(data.current_module, data)}</div>)
        }
        
        if (hasUserCompleted)
        { 
            return(<WaitingModule key="module-complete-message"/>)
        }


        return (<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}`} className="m-1 p-1">{parseModule(data.current_module, data)}</div>)
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
                        <EntrypointCountdown endDate={endDate} />
                        <div className="md:w-[1px] md:h-full  bg-amber-900"></div>
                        <EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
                    </div>
                    <div className="w-full h-full p-4 overflow-scroll">
                        {
                            isOwned || data.status === ENTRYPOINT_STATUS.EntrypointCompleted ?
                                getModule()
                                :
                                data.users.length < data.max_users ?
                                    <>
                                        {parseModule(0, data)}
                                    </>
                                    :
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
                            isOwner={isOwned}
                            claimEntryPointFunction={claimEntrypoint}
                            completeModuleFunction={requestUploads}
                            hasUserCompleted={hasUserCompleted}
                            canUserComplete={canUserComplete}
                        />
                    </div>
                </div>
            </div>
        )

    return (<NotFound />) //-- if data is not defined, it means we're still fetching it from the backend (so this should be a spinner instead)
}

export default Entrypoint