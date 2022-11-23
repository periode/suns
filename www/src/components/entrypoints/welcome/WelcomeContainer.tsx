import { useEffect, useState } from "react"
import AirContext from "../../../contexts/AirContext"
import Login from "../../../pages/auth/Login"
import MarkMaking from "../../modules/tasks/MarkMaking"
import WelcomeIntro from "./WelcomeIntro"

const Welcome = () => {
    const [stage, setStage] = useState(0) //-- 0 = text, 1 = mark making, 2 = signup

    useEffect(() => {
        switch (stage) {
            case 1:
                console.log("done with intro");
                break;
            case 2:
                console.log("done with mark making, hold it in memory for now");
                break;
            case 3:
                console.log("done with signing up, let's fetch all of this to the server. on promise resolve, open the new entrypoint.");
                break;
            default:
                break;
        }
    })

    const handleNextStage = () => {
        let s = stage + 1
        setStage(s)
    }

    return (
        <AirContext>
            <div className="bg-amber-50 w-full h-screen text-amber-900 flex flex-col items-center justify-center">
                {
                    stage === 0 ?
                        <WelcomeIntro/>
                        : stage === 1 ? <MarkMaking />
                            : stage === 2 ? <Login />
                                : <>This stage is too far. We should rather be redirecting you to a created entrypoint.</>
                }
                <button className="m-2 p-2 border" onClick={handleNextStage}>Next</button>
            </div>
        </AirContext>
    )
}

export default Welcome