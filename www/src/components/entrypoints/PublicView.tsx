import { FINAL_TYPE, IEntrypoint, IModule, IUpload, IUser, PARTNER_STATUS, UPLOAD_TYPE } from "../../utils/types"
import ContentAudio from "../modules/content/ContentAudio"
import ContentImage from "../modules/content/ContentImage"
import ContentVideoInternal from "../modules/content/ContentVideoInternal"
import ContentText from "../modules/content/ContentText"
import { AirTableContext } from "../../contexts/AirContext"
import { useContext } from "react"
import EntrypointPartners from "./EntrypointPartners"
import SeperatorFinal from "../commons/layout/SeperatorFinal"
import { useNavigate } from "react-router-dom"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {
    const navigate = useNavigate()
    const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

    const getUploadContent = (index: number, upload: IUpload, name: string): JSX.Element => {
        if (upload === undefined)
            return <>Couldnt get upload.type: undefined</>
        switch (upload.type) {
            case UPLOAD_TYPE.Text:
                return (
                    <ContentText index={index} key={upload.uuid} text={upload.text} name={upload.user_name} ep_name={entrypoint.airtable_key} final={true} />
                )
            case UPLOAD_TYPE.Image:
                return (
                    <ContentImage index={index} key={upload.uuid} src={upload.url} name={upload.user_name} ep_name={entrypoint.airtable_key} />
                )
            case UPLOAD_TYPE.Video:
                return (
                    <ContentVideoInternal index={index} key={upload.uuid} src={upload.url} name={upload.user_name} ep_name={entrypoint.airtable_key} />
                )
            case UPLOAD_TYPE.Audio:
                return (
                    <ContentAudio index={index} key={upload.uuid} src={upload.url} name={upload.user_name} ep_name={entrypoint.airtable_key} final={true} />
                )
            default:
                return <>Couldnt get upload.type: {upload.type}</>
        }
    }

    const getUploads = (uploads: Array<IUpload>, user: IUser, compare: (x: string, y: string) => boolean, alternate: boolean, moduleID: number): JSX.Element[] => {
        var Content: JSX.Element[] = []

        for (let i = 0; i < uploads.length; i++) {
            if (!alternate && compare(uploads[i].user_uuid, user.uuid))
                Content.push(getUploadContent(moduleID, uploads[i], user.name))
            if (alternate && !compare(uploads[i].user_uuid, user.uuid))
                Content.push(getUploadContent(moduleID, uploads[i], user.name))
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
                    Content.push(...getUploads(entrypoint.modules[moduleID].uploads, user, compare, isAlternated, moduleID))
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
        // console.log("entrypoint.final_module_type: ", entrypoint.final_module_type)
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

    const getHeader = () => { 

        var publicIntro = contents?.get(`${entrypoint.airtable_key}_intro`)

        return (
        <div className="w-full flex flex-col items-center gap-2
                                text-center text-sm">
            <div className="text-sm">
                This is the final outcome of the gesture <span className="italic">{entrypoint.name}</span>
            </div>
            {
                publicIntro && 
                <div className="w-full text-sm flex flex-col items-center gap-2 ">
                    <SeperatorFinal />
                        { publicIntro }
                    <SeperatorFinal/>
                </div>
            }
        </div>
        )
    }


    return (
        <div className="w-full h-full flex flex-col gap-8">
            {getHeader()}
            <div className="w-full flex flex-col gap-4 md:flex-row justify-between">
                {entrypoint.users.map((u, i) => {
                    return (
                        <div className="
                        flex-1 
                        flex flex-col

                        " key={u.uuid}>
                            {
                                getContent(u)
                            }
                            {
                                entrypoint.users.length > 1 && i === 0 &&
                                <div className="block md:hidden">
                                    <SeperatorFinal/>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
            {entrypoint.name === "Cracks" ?
                <button className=" flex items-center justify-center gap-1
                    h-8 bg-none p-2 pl-4 pr-4
                text-green-500 font-mono text-sm font-bold 
                border border-1 border-green-500
                hover:text-green-600 hover:border-green-600
                transition-all ease-in duration-300" onClick={() => { navigate(`/entrypoints/archive/cracks`, { replace: true }) }}>Go to the cracks archive</button>
                : <></>}
        </div >
    )


}

export default PublicView