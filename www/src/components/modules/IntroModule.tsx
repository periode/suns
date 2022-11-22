import { useContext, useEffect } from "react"
import { AirTableContext } from "../../contexts/AirContext"
import { IModule } from "../../utils/types"
import Content from "../commons/Content"

interface IntroModuleProps {
    data: IModule,
    epName: string,
    handleUserDone: Function,
}

const IntroModule = ({ data, epName, handleUserDone }: IntroModuleProps) => {
    
    useEffect(() => {
        handleUserDone(true)
    }, [handleUserDone])

    const ctx = useContext(AirTableContext)    
    const contents = ctx.get(epName)

    if (contents === undefined) {
        console.log(contents)
        return(<>
            There was a problem getting information from the Airtable
        </>)
    }

    return (<>
        <div className="flex flex-col">
            {
                data.contents.map((c) => {
                    return (
                        <Content key={c.key}type={c.type} airkey={c.key} contents={contents} />
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