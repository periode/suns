import { FINAL_TYPE, IEntrypoint } from "../../utils/types"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({ entrypoint }: PublicViewProps) => {
    


    var PublicViewContent : JSX.Element;
    if (entrypoint.max_users === 1)
    {
        // Single view
        return (
            <>
            </>
        )
    }

    switch (entrypoint.final_module_type) {
        case FINAL_TYPE.Seperate:

            break;
        case FINAL_TYPE.Tangled:

            break;
        case FINAL_TYPE.TangledInverted:

            break;
        default:

            break;
    }



    return (
        <div className="w-full flex gap-2">
            <div className="flex-1 ">
                
            </div>
            <div className="flex-1 ">

            </div>
        </div>
    )
}

export default PublicView