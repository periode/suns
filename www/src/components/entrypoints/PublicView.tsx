import { FINAL_TYPE, IEntrypoint, IUpload, IUser } from "../../utils/types"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {

    const getUploadContent = (upload: IUpload): JSX.Element => {
        if (upload === undefined)
            return <>Couldnt get upload.type: undefined</>
        switch (upload.type) {
            case "text/plain":
                return (
                    <div>{upload.text}</div>
                )
            case "image/*":
                return (
                    <div>{upload.url}</div>
                )
            case "video/*":
                return (
                    <div>{upload.url}</div>
                )
            case "audio/wav":
                return (
                    <div>{upload.url}</div>
                )
            default:
                return <>Couldnt get upload.type: {upload.type}</>
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


        return <></>
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