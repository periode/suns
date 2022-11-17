import { useContext } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IEntrypoint, IFile, IModule } from "../../utils/types"
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

    const ctx = useContext(AirTableContext)
    const contents = ctx.get(ep.name)

    const getTasks = () => {
        const tasks = data.tasks.map((task => {
            switch (task.type) {
                case "audio_input":
                    return (
                        <div className="w-full
                                        flex flex-col gap-4
                                                " key={`${task.type}-key`}>
                            <p>{contents?.get(task.key)}</p>

                            <AudioRecorder key={`${data.ID}-${data.name}`} mod={data} index={index} ep={ep} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>
                    )
                case "video_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <FileUploader type="video" maxUploads={task.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "image_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <FileUploader type="image" maxUploads={task.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "text_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${task.type}-key`}>
                        <p>{contents?.get(task.key)}</p>
                        <div className="h-60">
                            <TextInputField handleNewUploads={handleNewUploads} handleUserDone={handleUserDone} isRequestingUploads={isRequestingUploads} hasUserCompleted={hasUserCompleted} placeholder={task.placeholder && contents?.get(task.placeholder) }/>
                        </div>
                    </div>)
                default:
                    return (<>Could not find task type ({task.type})</>)
            }
        }))

        return tasks
    }

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {getTasks()}
        </div>
    )
}

export default TaskModule