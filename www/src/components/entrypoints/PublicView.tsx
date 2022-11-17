import { FINAL_TYPE, IEntrypoint, IUpload, IUser } from "../../utils/types"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {
    
    console.log("Loggin entrypoint in PublicView Component : " + entrypoint)

    var contentUser0: JSX.Element[] = [] ;
    var contentUser1: JSX.Element[] = [] ;

    const getUploadContent = (upload: IUpload) : JSX.Element =>
    {
        switch (upload.type) {
            case "text_input":
                return (
                    <>{ upload.text }</>
                )
            case "image_input":
                return (
                    <>{ upload.url }</>
                )
            case "video_input":
                return (
                    <>{ upload.url }</>
                )
            case "audio_input":
                return (
                    <>{ upload.url }</>
                )
            default:
                return <>Couldnt get upload.type: { upload.type }</>
        }
    }

    const getContent = (user: IUser): JSX.Element => {
        
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
        <div className="w-full flex gap-2">
            <div className="flex-1 ">
                <h2>{entrypoint.users[0].name}</h2>
                { 
                    getContent(entrypoint.users[0])
                }
            </div>
            <div className="h-full w-[1px] background-amber-100"></div>
            <div className="flex-1 ">
                <h2>{entrypoint.users[1].name}</h2>
                {  
                    getContent(entrypoint.users[1])
                }
            </div>
        </div>
    )
}

export default PublicView