import { useContext } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IModule } from "../../utils/types"
import Seperator from "../commons/layout/Seperator"
import Content from "./content/Content"

interface IntroModuleProps {
    data: IModule,
    airtable_key: string,
}

const IntroModule = ({ data, airtable_key }: IntroModuleProps) => {
    
    const ctx = useContext(AirTableContext)    
    const contents = ctx.get(airtable_key)

    if (contents === undefined) {
        return(<>
            Intro module: There was a problem getting information from the database { airtable_key }
        </>)
    }

    return (<>
        <div className="w-full flex flex-col gap-8 items-center">
            {
                data.contents.map((c, i) => {
                    return (
                        <>
                            <Content key={c.key} type={c.type} airkey={c.key} contents={contents} />
                            { 
                                i < data.contents.length - 1 &&
                                    <Seperator/>
                            }
                        </>
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
