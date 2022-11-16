import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IEntrypoint, IFile, IModule } from "../../utils/types"
import TextInputField from "../commons/forms/inputs/TextInputField"
import AudioRecorder from "./AudioRecorder"
import FileUploader from "./FileUploader"

interface ITaskModuleProps {
    data: IModule,
    ep: IEntrypoint,
    index: number,
    setUploads: Dispatch<SetStateAction<IFile[]>>,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const TaskModule = ({ data, ep, index, setUploads, setUserDone, hasUserCompleted }: ITaskModuleProps) => {

    const ctx = useContext(AirTableContext)
    const contents = ctx.get(ep.name)

    const getTasks = () => {
        const tasks = data.tasks.map((task => {
            switch (task.type) {
                case "audio_input":
                    return (
                        <div key={`${task.type}-key`}>
                            <p>{contents?.get(task.key)}</p>

                            <AudioRecorder key={`${data.ID}-${data.name}`} mod={data} index={index} ep={ep} setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>
                    )
                case "video_input":
                    return (<div key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <FileUploader type="video" setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "image_input":
                    return (<div key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <FileUploader type="image" setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "text_input":
                    return (<div key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <TextInputField setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                default:
                    return (<>Could not find task type ({task.type})</>)
            }
        }))

        return tasks
    }

    return (
        <>
            {getTasks()}
        </>
    )
}

export default TaskModule