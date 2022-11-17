import { FINAL_TYPE, IEntrypoint } from "../../utils/types"

interface PublicViewProps {
    entrypoint: IEntrypoint
}

const PublicView = ({entrypoint} : PublicViewProps) => {

    var PublicViewContent : JSX.Element;
    if (entrypoint.max_users === 1)
    {
        // Single view
    }

    switch (entrypoint.final_type) {
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
        <div>
            {  }
        </div>
    )
}

export default PublicView