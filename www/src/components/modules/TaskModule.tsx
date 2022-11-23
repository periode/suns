import { useContext, useEffect, useState } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { getSession } from "../../utils/auth"
import { IEntrypoint, IFile, IModule, IUpload } from "../../utils/types"
import TextInputField from "../commons/forms/inputs/TextInputField"
import AudioRecorder from "./tasks/AudioRecorder"
import FileUploader from "./tasks/utils/FileUploader"

interface ITaskModuleProps {
    data: IModule,
    ep: IEntrypoint,
    index: number,
    handleNewUploads: Function,
    isRequestingUploads: boolean,
    handleUserDone: Function,
    hasUserCompleted: boolean
}

const TaskModule = ({ data, ep, index, handleNewUploads, isRequestingUploads, handleUserDone, hasUserCompleted }: ITaskModuleProps) => {
    const session = getSession()
    const [inputs, setInputs] = useState(Array<IUpload>)
    const ctx = useContext(AirTableContext)
    const contents = ctx.get(ep.name)

    useEffect(() => {
        if (index > 0 && ep.modules[index - 1] != undefined)
            setInputs(ep.modules[index - 1].uploads ? ep.modules[index - 1].uploads : [])
    }, [ep])

    const getTasks = () => {
        const tasks = data.tasks.map(((t, i) => {
            switch (t.type) {
                case "audio_input":
                    return (
                        <div className="w-full
                                        flex flex-col gap-4
                                                " key={`${t.type}-key-${i}`}>
                            <p>{contents?.get(t.key)}</p>

                            <AudioRecorder mod={data} index={index} ep={ep} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>
                    )
                case "video_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{contents?.get(t.key)}</p>
                            <FileUploader type="video" maxUploads={t.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>)
                case "image_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{contents?.get(t.key)}</p>
                            <FileUploader type="image" maxUploads={t.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>)
                case "text_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{contents?.get(t.key)}</p>
                            <div className="h-60">
                                <TextInputField handleNewUploads={handleNewUploads} handleUserDone={handleUserDone} isRequestingUploads={isRequestingUploads} hasUserCompleted={hasUserCompleted} placeholder={t.placeholder && contents?.get(t.placeholder)} />
                            </div>
                        </div>)
                default:
                    return (<>Could not find task type ({t.type})</>)
            }
        }))

        return tasks
    }

    const getInputPrompt = () => {
        if (inputs === null || inputs.length === 0) return (<></>)

        let inputElements = []
        for (const i of inputs) {
            if (i.user_uuid !== session.user.uuid)
                switch (true) {
                    case i.type.startsWith("text/plain"):
                        inputElements.push((<>{i.text}</>))
                        break;
                    case i.type.startsWith("audio/"):
                        inputElements.push((<audio src={`${process.env.REACT_APP_API_URL}/static/${i.url}`} controls></audio>))
                        break;
                    case i.type.startsWith("video/"):
                        inputElements.push((<video src={`${process.env.REACT_APP_API_URL}/static/${i.url}`} controls></video>))
                        break;
                    case i.type.startsWith("image/"):
                        inputElements.push((<img src={`${process.env.REACT_APP_API_URL}/static/${i.url}`} alt={i.url} />))
                        break;

                    default:
                        break;
                }
        }
        if (inputElements.length == 0)
            return (<>Could not find proper prompt</>)
        else
            return inputElements
    }

    return (
        <>
            <div className="w-full">
                {
                    inputs && inputs.length > 0 ?
                        <>
                            {getInputPrompt()}
                        </> : <></>
                }
            </div>
            <div className="w-full h-full flex flex-col gap-6">
                {getTasks()}
            </div>
        </>

    )
}

export default TaskModule