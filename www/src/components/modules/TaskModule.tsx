import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IEntrypoint, IModule } from "../../utils/types"
import AudioRecorder from "./AudioRecorder"

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
                        <>
                            <p key={`${task.type}-${task.key}-prompt`}>{contents?.get(task.key)}</p>

                            <AudioRecorder key={`${data.ID}-${data.name}`} mod={data} index={index} ep={ep} setUploads={setUploads} setUserDone={setUserDone} hasUserCompleted={hasUserCompleted} />
                        </>
                    )
                case "video_input":
                    return (<>
                        video input
                    </>)
                case "image_input":
                    return (<>
                        image input
                    </>)
                case "text_input":
                    return (<>
                        <input type="text" />
                    </>)
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