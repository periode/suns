import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IModule } from "../../utils/types"
import IntroContent from "./content/IntroContent"

interface IntroModuleProps {
    data: IModule,
    epName: string,
    index: number,
    handleUserDone: Function,
}

const IntroModule = ({ data, epName, index, handleUserDone }: IntroModuleProps) => {
    
    useEffect(() => {
        handleUserDone(true)
    }, [])

    const ctx = useContext(AirTableContext)    
    const contents = ctx.get(epName)

    if (contents === undefined) {
        console.log(contents)
        return(<>
            There was a problem getting information from the Airtable
        </>)
    }

    return (<>
        <div className="flex flex-col gap-4 items-start">
            {
                data.contents.map((c) => {
                    return (
                        <IntroContent key={c.key} type={c.type} airkey={c.key} contents={contents} />
                    )   
                })
            }
        </div>
        <p className="mt-5">
            {data.content}
        </p>
    </>)
}

export default IntroModule