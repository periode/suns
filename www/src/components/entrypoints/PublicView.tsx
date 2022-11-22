import { FINAL_TYPE, IEntrypoint, IUpload, IUser } from "../../utils/types"

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
                    <div>{ upload.text }</div>
                )
            case upload.type.startsWith("image/"):
                return (
                    <div>{ upload.url }</div>
                )
            case upload.type.startsWith("video/"):
                return (
                    <div>{ upload.url }</div>
                )
            case upload.type.startsWith("audio/"):
                return (
                    <div>{ upload.url }</div>
                )
            default:
                return <>Couldnt get upload.type: { upload.type }</>
        }
    }

    const getContent = (user: IUser): JSX.Element => {
        
        if (
            entrypoint === undefined 
            || entrypoint.modules.length === 0 
            || entrypoint.modules[1].uploads.length === 0 
            || entrypoint.modules[2].uploads.length === 0

        )
            return (<></>)

        var Content1 : JSX.Element
        var Content2 : JSX.Element
       
        switch (entrypoint.final_module_type) {
            case FINAL_TYPE.Seperate:
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
                        { Content1 } 
                        { Content2 }
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
                        { Content1 } 
                        { Content2 }
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
                        { Content1 } 
                        { Content2 }
                    </>
                )
            }
            default:
            {
                break;
            }
        }


        return <></>
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4">
            <div className="">
                <h2>{entrypoint.users[0].name}</h2>
                { 
                    getContent(entrypoint.users[0])
                }
            </div>
            <div className="">
                <h2>{entrypoint.users[1].name}</h2>
                {  
                    getContent(entrypoint.users[1])
                }
            </div>
        </div>
    )
}

export default PublicView