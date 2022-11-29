import { FINAL_TYPE, IEntrypoint, IModule, IUpload, IUser, UPLOAD_TYPE } from "../../utils/types"
import ContentAudio from "../modules/content/ContentAudio"
import ContentImage from "../modules/content/ContentImage"
import ContentVideoInternal from "../modules/content/ContentVideoInternal"
import ContentText from "../modules/content/ContentText"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {

    const getUploadContent = (upload: IUpload): JSX.Element => {
        if (upload === undefined)
            return <>Couldnt get upload.type: undefined</>
        switch (upload.type) {
            case UPLOAD_TYPE.Text:
                return (
                    <ContentText key={upload.uuid} text={upload.text} />
                )
            case UPLOAD_TYPE.Image:
                return (
                    <ContentImage key={upload.uuid} src={upload.url} />
                )
            case UPLOAD_TYPE.Video:
                return (
                    <ContentVideoInternal key={upload.uuid} src={upload.url} />
                )
            case UPLOAD_TYPE.Audio:
                return (
                    <ContentAudio key={upload.uuid} src={upload.url} />
                )
            default:
                return <>Couldnt get upload.type: {upload.type}</>
        }
    }

    const getUploads = (uploads: Array<IUpload>, uuid: string, compare: (x: string, y: string) => boolean, alternate: boolean,): JSX.Element[] => {
        var Content: JSX.Element[] = []

        for (let i = 0; i < uploads.length; i++) {
            if (!alternate && compare(uploads[i].user_uuid, uuid))
                Content.push(getUploadContent(uploads[i]))
            if (alternate && !compare(uploads[i].user_uuid, uuid))
                Content.push(getUploadContent(uploads[i]))
        }
        return (Content)
    }

    const getModules = (user: IUser, modules: IModule[], compare: (x: string, y: string) => boolean, alternate: boolean) => {
        if (user === undefined
            || user.uuid === undefined
        )
            return <>user undefined</>
        var Content: JSX.Element[] = []
        
        var isAlternated = false;
        for (let moduleID = 1; moduleID < modules.length - 1; moduleID++) {
            if (modules[moduleID].uploads.length !== 0) {
                if (!modules[moduleID].uploads[0])
                    Content.push(<>Upload does not exist</>)
                else
                    Content.push(...getUploads(entrypoint.modules[moduleID].uploads, user.uuid, compare, isAlternated))
                if (alternate)
                    isAlternated = !isAlternated
            }
        }
        return (
            <>
                {Content.map((element: JSX.Element) => { return element })}
            </>
        )
    }

    const equalString = (x: string, y: string): boolean => {
        if (x === y)
            return true
        else return false
    }
    const notequalString = (x: string, y: string): boolean => {
        if (x !== y)
            return true
        else return false
    }


    const getContent = (user: IUser): JSX.Element => {
        if (
            entrypoint === undefined
            || entrypoint.modules.length === 0
            || user === undefined
            || user.uuid === undefined
        )
            return (<>A problem occured</>)

        switch (entrypoint.final_module_type) {
            case FINAL_TYPE.Separate:
                return (getModules(user, entrypoint.modules, equalString, false))
            case FINAL_TYPE.Tangled:
                return (getModules(user, entrypoint.modules, equalString, true))
            case FINAL_TYPE.TangledInverted:
                return (getModules(user, entrypoint.modules, notequalString, true))
            default:
                {
                    break;
                }
        }

        return <>A problem occured, entrypoint.final_module_type: {entrypoint.final_module_type}</>
    }


    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8">
            {entrypoint.users.map(u => {
                return (
                    <div className="
                        flex-1 
                        flex flex-col gap-2
                        " key={u.uuid}>
                        <h2 className="text-2xl font-regular">{u.name}</h2>
                        {getContent(u)}
                    </div>
                )
            })}
        </div >
    )


}

export default PublicView