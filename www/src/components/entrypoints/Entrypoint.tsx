import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { FiCommand, FiX } from "react-icons/fi"

import "../../styles/entrypoint.css"
import { getSession } from "../../utils/auth";
import EntrypointActions from "./EntrypointActions";
import PublicView from "./PublicView";
import NotFound from "../../NotFound";
import FinalFirstTimes from "../modules/FinalFirstTimes";
import { ENTRYPOINT_STATUS, IEntrypoint, IFile, ISession, TaskDoneType } from "../../utils/types";
import IntroModule from "../modules/IntroModule";
import TaskModule from "../modules/TaskModule";
import { fetchEntrypoint, progressModule, submitUpload } from "../../utils/entrypoint";
import WaitingModule from "../modules/WaitingModule";
import EntrypointLayout from "./Layouts/EntrypointLayout";

const FETCH_INTERVAL = 50 * 1000
const ENTRYPOINT_LIFETIME_MINUTES = 72 * 60

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

    //-- tasksDone keeps track of when the user can submit the module
    const [tasksDone, setTasksDone] = useState(Array<TaskDoneType>)

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
        if (tasksDone.length == 0) return

        let isDone = true
        for (const task of tasksDone) {
            if (task.value == false) {
                isDone = false
                break
            }
        }

        setCanUserComplete(isDone)
    }, [tasksDone])

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
    }, [isOwned, data, session.user.uuid])

    //-- this checks if all uploads have been submitted before completing the module (should be a useCallback?)
    useEffect(() => {
        if (data === undefined)
            return

        if (uploads.length === data.modules[data.current_module].tasks.length && !hasSubmittedModule.current) {
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
                    let tasks = e.modules[e.current_module].tasks.map(t => { return { key: t.uuid, value: false } })
                    setTasksDone(tasks)
                    setRequestingUploads(false)
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
            setCanUserComplete(false)
        } else {
            console.warn('error', res.status)
        }
    }

    const handleNewUploads = (_new: Array<IFile>) => {
        setUploads(prev => {
            return [...prev, ..._new] as IFile[]
        })
    }

    const handleTasksDone = (_task: TaskDoneType) => {
        let tmp = [...tasksDone]
        let hasFound = false
        for (const task of tmp) {
            if (task.key === _task.key) {
                task.value = _task.value
                hasFound = true
                break
            }
        }

        if (!hasFound)
            tmp.push(_task)

        setTasksDone(tmp)
    }

    const handleNext = () => {
        console.log('triggering next module, currently requesting uploads:', isRequestingUploads);

        if (data.modules[data.current_module].tasks.length > 0 && data.modules[data.current_module].tasks[0].type != "prompts_input")
            setRequestingUploads(true)
        else
            completeModule(data, session)
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
                //-- completion always means the user is done with their input
                setTasksDone([])
                setRequestingUploads(false)

                //-- check if we're done with the module
                if (updated.current_module === ep.current_module)
                    setUserCompleted(true) //-- we have a partial state
                else
                    setUserCompleted(false) //-- we move on to the next module

                setCanUserComplete(false)
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
                    <IntroModule epName={ep.name} data={mod} handleTasksDone={handleTasksDone} />
                )
            case "task":
                return (
                    <TaskModule index={index} ep={ep} data={mod} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleTasksDone={handleTasksDone} hasUserCompleted={hasUserCompleted} />
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


        return (<div key={`mod-${data.name.split(' ').join('-')}-${data.current_module}`} className="m-1 p-1">{parseModule(data.current_module, data)}</div>)
    }

    if (data !== undefined)
        return (
            <div className="absolute z-20 w-full h-full p-4 
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
                                    (data.cluster.name != "Welcome" || data.current_module == data.modules.length - 1) ?
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