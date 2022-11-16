import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IEntrypoint, IModule } from "../../utils/types"
import AudioRecorder from "./AudioRecorder"
import FileUploader from "./FileUploader"
import TextInput from "./TextInput"

interface ITaskModule {
    data: IModule,
    ep: IEntrypoint,
    index: number,
    setUploads: Dispatch<SetStateAction<File[]>>,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const TaskModule = ({ data, ep, index, setUploads, setUserDone, hasUserCompleted }: ITaskModule) => {

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
                        <FileUploader/>
                    </div>)
                case "image_input":
                    return (<div key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <FileUploader/>
                    </div>)
                case "text_input":
                    return (<div key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <TextInput />
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