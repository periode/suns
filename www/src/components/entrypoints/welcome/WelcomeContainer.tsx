import { useEffect, useState } from "react"
import AirContext from "../../../contexts/AirContext"
import SignUp from "../../../pages/auth/SignUp"
import NextButton from "../../commons/buttons/NextButton"
import MarkMaker from "./MarkMaker/MarkMaker"
import WelcomeIntro from "./WelcomeIntro"

const Welcome = () => {

    const [stage, setStage] = useState(0) //-- 0 = text, 1 = mark making, 2 = signup
    const [mark, setMark] = useState<Blob>()

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
            <div className="w-full h-screen p-4
                            bg-amber-50 text-amber-900 font-serif leading-relaxed
                            flex flex-col items-center justify-between md:justify-center gap-4
                            ">
                <div className="w-full
                                flex-grow md:flex-grow-0
                                flex items-center justify-center">
                    {
                        stage === 0 ?
                         <WelcomeIntro/>
                        : stage === 1 ? <MarkMaker setMark={setMark} />
                            : stage === 2 ? <SignUp mark={mark}/>
                      
                            : <>This stage is too far. We should rather be redirecting you to a created entrypoint.</>
                    }
                </div >
                {
                    stage < 2 &&
                    <NextButton handleNextStage={handleNextStage}/>
                }
            </div>
        </AirContext>
    )
}

export default Welcome