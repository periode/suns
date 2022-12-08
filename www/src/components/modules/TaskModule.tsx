import { useContext, useEffect, useState } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { getSession } from "../../utils/auth"
import { IEntrypoint, IModule, IUpload, UPLOAD_TYPE } from "../../utils/types"
import TextInputField from "../commons/forms/inputs/TextInputField"
import WelcomePrompts from "../entrypoints/welcome/WelcomePrompts"
import ContentAudio from "./content/ContentAudio"
import ContentImage from "./content/ContentImage"
import ContentText from "./content/ContentText"
import ContentVideoInternal from "./content/ContentVideoInternal"
import AudioRecorder from "./tasks/AudioRecorder"
import FileUploader from "./tasks/utils/FileUploader"

interface ITaskModuleProps {
    data: IModule,
    ep: IEntrypoint,
    index: number,
    handleNewUploads: Function,
}

const TaskModule = ({ data, ep, index, handleNewUploads }: ITaskModuleProps) => {
    const session = getSession()
    const [inputs, setInputs] = useState(Array<IUpload>)
    const ctx = useContext(AirTableContext)
    const contents = ctx.get(ep.name)

    useEffect(() => {
        if (index > 0 && ep.modules[index - 1] !== undefined)
            setInputs(ep.modules[index - 1].uploads ? ep.modules[index - 1].uploads : [])
    }, [ep, index])

    const getTasks = () => {
        const tasks = data.tasks.map(((t, i) => {
            const prompt = contents ? contents.get(t.key) : t.value !== "" ? t.value : "No prompt for this task"
            switch (t.type) {
                case "audio_input":
                    return (
                        <div className="w-full
                                        flex flex-col gap-4
                                                " key={`${t.type}-key-${i}`}>
                            <p>{prompt}</p>

                            <AudioRecorder uuid={t.uuid} mod={data} ep={ep} handleNewUploads={handleNewUploads}  />
                        </div>
                    )
                case "video_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{prompt}</p>
                            <FileUploader uuid={t.uuid} type={UPLOAD_TYPE.Video} maxUploads={t.max_limit} handleNewUploads={handleNewUploads} />
                        </div>)
                case "image_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{prompt}</p>
                            <FileUploader uuid={t.uuid} type={UPLOAD_TYPE.Image} maxUploads={t.max_limit} handleNewUploads={handleNewUploads} />
                        </div>)
                case "text_input":
                    return (
                        <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                            <p>{prompt}</p>
                            <div className="h-auto">
                                <TextInputField uuid={t.uuid} text_type={t.text_type} minLimit={t.min_limit} maxLimit={t.max_limit} handleNewUploads={handleNewUploads} placeholder={t.placeholder && contents?.get(t.placeholder)} />
                            </div>
                        </div>)
                case "prompts_input":
                    return (<div className="w-full
                    flex flex-col gap-4
                            " key={`${t.type}-key-${i}`}>
                        <p>{prompt}</p>
                        <div className="h-60">
                            <WelcomePrompts uuid={t.uuid}/>
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
                switch (i.type) {
                    case UPLOAD_TYPE.Text:
                        inputElements.push((<ContentText key={i.uuid} text={i.text}/>))
                        break;
                    case UPLOAD_TYPE.Audio:
                        inputElements.push((<ContentAudio key={i.uuid} src={i.url}/>))
                        break;
                    case UPLOAD_TYPE.Video:
                        inputElements.push((<ContentVideoInternal key={i.uuid} src={i.url}/>))
                        break;
                    case UPLOAD_TYPE.Image:
                        inputElements.push((<ContentImage key={i.uuid} src={i.url}/>))
                        break;

                    default:
                        break;
                }
        }
        if (inputElements.length === 0)
            return (<>Could not find proper prompt</>)
        else
            return inputElements
    }

    return (
        <>
            <div className="w-full">
                {
                    data.showPreviousUploads ?
                        <>
                            {getInputPrompt()}
                        </> : <></>
                }
            </div>
            <div className="w-full h-full flex flex-col gap-6">
                {
                    getTasks()
                }
            </div>
        </>

    )
}

export default TaskModule