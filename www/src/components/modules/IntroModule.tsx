import { useContext } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IModule } from "../../utils/types"
import Content from "./content/Content"

interface IntroModuleProps {
    data: IModule,
    epName: string,
}

const IntroModule = ({ data, epName }: IntroModuleProps) => {
    

    const ctx = useContext(AirTableContext)    
    const contents = ctx.get(epName)

    if (contents === undefined) {
        return(<>
            There was a problem getting information from the Airtable
        </>)
    }

    return (<>
        <div className="flex flex-col gap-4 items-start">
            {
                data.contents.map((c) => {
                    return (
                        <Content key={c.key} type={c.type} airkey={c.key} contents={contents} />
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