import { equal } from "assert"
import { FINAL_TYPE, IEntrypoint, IModule, IUpload, IUser } from "../../utils/types"
import ContentAudio from "../modules/content/ContentAudio"
import ContentPhoto from "../modules/content/ContentPhoto"
import ContentVideo from "../modules/content/ContentVideo"
import ContentText from "../modules/content/ContextText"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {

    const getUploadContent = (upload: IUpload): JSX.Element => {
        if (upload === undefined)
            return <>Couldnt get upload.type: undefined</>
        switch (true) {
            case upload.type.startsWith("text/"):
                return (
                    <div>{upload.text}</div>
                )
            case upload.type.startsWith("image/"):
                return (
                    <div>{upload.url}</div>
                )
            case upload.type.startsWith("video/"):
                return (
                    <div>{upload.url}</div>
                )
            case upload.type.startsWith("audio/"):
                return (
                    <div>{upload.url}</div>
                )
            default:
                return <>Couldnt get upload.type: {upload.type}</>
        }
    }


    const getModuleContent = (module: IModule, user : IUser, compare : (x:string, y:string) => {}, alternate: boolean) : JSX.Element => 
    {
        let Content1 : JSX.Element[] = []
        let Content2 : JSX.Element[] = []

        var isAlternated = false; 
        for (let i = 0; i < module.uploads.length; i++)
        {
            if (isAlternated === false)
            {
                compare(module.uploads[i].user_uuid, user.uuid) ?
                Content1.push( getUploadContent(module.uploads[i])) : Content2.push(getUploadContent(module.uploads[i]))
            }
            else
            {
                !compare(module.uploads[i].user_uuid, user.uuid) ?
                Content1.push( getUploadContent(module.uploads[i])) : Content2.push(getUploadContent(module.uploads[i]))
            }
            
            if (alternate)
                isAlternated = !isAlternated
        }

        return (
            <>
                { Content1.map((element:JSX.Element)=>{return element}) }
                { Content2.map((element:JSX.Element)=>{return element}) }
            </>
        )
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
            return (<></>)

        var Content1: JSX.Element
        var Content2: JSX.Element

        switch (entrypoint.final_module_type) {
            case FINAL_TYPE.Separate:
                {
                    // Task and belong to both users
                    entrypoint.modules[1].uploads[0].user_uuid === user.uuid ?
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[0])
                        :
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[1])

                    entrypoint.modules[2].uploads[0].user_uuid === user.uuid ?
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[0])
                        :
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[1])

                    return (
                        <>
                            {Content1}
                            {Content2}
                        </>
                    )
                }
            case FINAL_TYPE.Tangled:
                {
                    // First module + Second Module from the other user
                    entrypoint.modules[1].uploads[0].user_uuid === user.uuid ?
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[0])
                        :
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[1])

                    entrypoint.modules[2].uploads[0].user_uuid !== user.uuid ?
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[0])
                        :
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[1])

                    return (
                        <>
                            {Content1}
                            {Content2}
                        </>
                    )
                }
            case FINAL_TYPE.TangledInverted:
                {
                    entrypoint.modules[1].uploads[0].user_uuid !== user.uuid ?
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[0])
                        :
                        Content1 = getUploadContent(entrypoint.modules[1].uploads[1])

                    entrypoint.modules[2].uploads[0].user_uuid === user.uuid ?
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[0])
                        :
                        Content2 = getUploadContent(entrypoint.modules[2].uploads[1])

                    return (
                        <>
                            {Content1}
                            {Content2}
                        </>
                    )
                }
            default:
                {
                    break;
                }
        }

        return <>A problem occured, entrypoint.final_module_type: { entrypoint.final_module_type }</>
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4">
            {entrypoint.users.map((u : IUser) => {
                return (
                    <div className="">
                        <h2>{u.name}</h2>
                        {
                            getContent(u)
                        }
                    </div>
                )
            })}
        </div >
    )
}

export default PublicView