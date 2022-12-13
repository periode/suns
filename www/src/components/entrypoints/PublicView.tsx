import { FINAL_TYPE, IEntrypoint, IModule, IUpload, IUser, PARTNER_STATUS, UPLOAD_TYPE } from "../../utils/types"
import ContentAudio from "../modules/content/ContentAudio"
import ContentImage from "../modules/content/ContentImage"
import ContentVideoInternal from "../modules/content/ContentVideoInternal"
import ContentText from "../modules/content/ContentText"
import { AirTableContext } from "../../contexts/AirContext"
import { useContext } from "react"
import EntrypointPartners from "./EntrypointPartners"
import SeperatorFinal from "../commons/layout/SeperatorFinal"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {

    const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

    const getUploadContent = (index: number, upload: IUpload, name: string): JSX.Element => {
        if (upload === undefined)
            return <>Couldnt get upload.type: undefined</>
        switch (upload.type) {
            case UPLOAD_TYPE.Text:
                return (
                    <ContentText index={index} key={upload.uuid} text={upload.text} name={name} ep_name={entrypoint.airtable_key} final={true} />
                )
            case UPLOAD_TYPE.Image:
                return (
                    <ContentImage index={index} key={upload.uuid} src={upload.url} name={name} ep_name={entrypoint.airtable_key} />
                )
            case UPLOAD_TYPE.Video:
                return (
                    <ContentVideoInternal index={index} key={upload.uuid} src={upload.url} name={name} ep_name={entrypoint.airtable_key} />
                )
            case UPLOAD_TYPE.Audio:
                return (
                    <ContentAudio index={index} key={upload.uuid} src={upload.url} name={name} ep_name={entrypoint.airtable_key} />
                )
            default:
                return <>Couldnt get upload.type: {upload.type}</>
        }
    }

    const getUploads = (uploads: Array<IUpload>, user: IUser, compare: (x: string, y: string) => boolean, alternate: boolean,): JSX.Element[] => {
        var Content: JSX.Element[] = []

        for (let i = 0; i < uploads.length; i++) {
            if (!alternate && compare(uploads[i].user_uuid, user.uuid))
                Content.push(getUploadContent(i, uploads[i], user.name))
            if (alternate && !compare(uploads[i].user_uuid, user.uuid))
                Content.push(getUploadContent(i, uploads[i], user.name))
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
                    Content.push(...getUploads(entrypoint.modules[moduleID].uploads, user, compare, isAlternated))
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

    const getHeader = () => { 
        return (
        <div className="w-full flex flex-col items-center pt-4
                                text-center text-sm">
            <div>
                This is the final outcome of the gesture <span className="italic">{entrypoint.name}</span> by
            </div>
            <EntrypointPartners
                users={entrypoint.users}
                max_users={entrypoint.max_users}
                partner_status={PARTNER_STATUS.PartnerFull}
            />
            <div>
                {contents?.get(`${entrypoint.airtable_key}_intro`)}
            </div>
        </div>
        )
    }


    return (
        <div className="w-full h-full flex flex-col gap-8">
            {getHeader()}
            <div className="flex flex-row justify-between">
                {entrypoint.users.map(u => {
                    return (
                        <div className="
                        flex-1 
                        flex flex-col gap-4 m-1
                        " key={u.uuid}>
                            {getContent(u)}
                        </div>
                    )
                })}
            </div>
        </div >
    )


}

export default PublicView