import { Dispatch, SetStateAction, useEffect } from "react"
import { IModule } from "../../utils/types"

interface ITaskModule {
    data: IModule,
    epName: string,
    index: number,
    setUserDone: Dispatch<SetStateAction<boolean>>
}

const TaskModule = ({data, epName, index, setUserDone} : ITaskModule) => {

    return(
        <>
        lol
        </>
    )
}

export default TaskModule