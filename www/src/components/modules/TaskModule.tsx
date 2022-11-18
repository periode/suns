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
        const tasks = data.tasks.map(((t, i) => {
            const prompt = contents ? contents.get(t.key) : t.value != "" ? t.value : "No prompt for this task"

            switch (t.type) {
                case "audio_input":
                    return (
                        <div className="w-full
                                        flex flex-col gap-4
                                                " key={`${t.type}-key-${i}`}>
                            <p>{prompt}</p>

                            <AudioRecorder mod={data} index={index} ep={ep} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted} />
                        </div>
                    )
                case "video_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                        <p>{prompt}</p>
                        <FileUploader type="video" maxUploads={t.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "image_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                        <p>{prompt}</p>
                        <FileUploader type="image" maxUploads={t.max_uploads} handleNewUploads={handleNewUploads} isRequestingUploads={isRequestingUploads} handleUserDone={handleUserDone} hasUserCompleted={hasUserCompleted}/>
                    </div>)
                case "text_input":
                    return (
                    <div className="w-full
                                    flex flex-col gap-4
                                            " key={`${t.type}-key-${i}`}>
                        <p>{prompt}</p>
                        <div className="h-60">
                            <TextInputField handleNewUploads={handleNewUploads} handleUserDone={handleUserDone} isRequestingUploads={isRequestingUploads} hasUserCompleted={hasUserCompleted} placeholder={t.placeholder && contents?.get(t.placeholder) }/>
                        </div>
                    </div>)
                default:
                    return (<>Could not find task type ({t.type})</>)
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