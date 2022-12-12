import { useContext } from "react"
import { AirTableContext } from "../../../contexts/AirContext"

const WelcomeIntro = () => {
    const ctx = useContext(AirTableContext)
    
    const contents = ctx.get("Welcome")
    if (contents === undefined) {
        return (<>
            Intro : There was a problem getting information from the database
        </>)
    }
    
    return (
        <div className="">
            { contents.get("intro_txt_1")}
        </div>
    )
}

export default WelcomeIntro