import { FINAL_TYPE, IEntrypoint, IModule, IUpload, IUser } from "../../utils/types"
import ContentAudio from "../modules/content/ContentAudio"
import ContentPhoto from "../modules/content/ContentPhoto"
import ContentVideo from "../modules/content/ContentVideo"
import ContentText from "../modules/content/ContextText"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {

    const getUploadContent = (upload: IUpload) : JSX.Element =>
    {
        if ( upload === undefined )
            return <>Couldnt get upload.type: undefined</>
        switch (true) {
            case upload.type.startsWith("text/"):
                return (
                    <ContentText text={upload.text}/>
                )
            case upload.type.startsWith("image/"):
                return (
                    <ContentPhoto src={upload.url}/>
                )
            case upload.type.startsWith("video/"):
                return (
                    <ContentVideo src={upload.url}/>
                )
            case upload.type.startsWith("audio/"):
                return (
                    <ContentAudio src={ upload.url }/>
                )
            default:
                return <>Couldnt get upload.type: { upload.type }</>
        }
    }

    const getModules = (user: IUser, modules: IModule[], compare: (x: string, y: string) => boolean, alternate: boolean) =>
    {
        if (user === undefined
            || user.uuid === undefined
            )
            return <>user undefined</>
        var Content : JSX.Element[] = []

        var isAlternated = false; 
        for (let moduleID = 1; moduleID < modules.length - 1; moduleID++)
        {
            if (!modules[moduleID].uploads[0])
            {
                Content.push(<>Upload does not exist</>)
            }
            else if (isAlternated)
            { 
                compare(entrypoint.modules[moduleID].uploads[0].user_uuid, user.uuid) ?
                Content.push(getUploadContent(entrypoint.modules[moduleID].uploads[0]))
                :
                Content.push(getUploadContent(entrypoint.modules[moduleID].uploads[1]))
            }
            else
            { 
                !compare(entrypoint.modules[moduleID].uploads[0]?.user_uuid, user.uuid) ?
                Content.push(getUploadContent(entrypoint.modules[moduleID].uploads[0]))
                :
                Content.push(getUploadContent(entrypoint.modules[moduleID].uploads[1]))
            }
            if (alternate)
                isAlternated = !isAlternated
        }
        return (
            <>
                { Content.map((element:JSX.Element)=>{return element}) }
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
            || entrypoint.modules[1].uploads.length === 0 
            || entrypoint.modules[2].uploads.length === 0
            || user === undefined
            || user.uuid === undefined
        )
            return (<>A problem occured</>)
       
        switch (entrypoint.final_module_type) {
            case FINAL_TYPE.Seperate:
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

        return <>A problem occured, entrypoint.final_module_type: { entrypoint.final_module_type }</>
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-regular">{entrypoint.users[0].name}</h2>
                { getContent(entrypoint.users[0]) }
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-regular">{entrypoint.users[1].name}</h2>
                { getContent(entrypoint.users[1]) }
            </div>
        </div>
    )
}

export default PublicView