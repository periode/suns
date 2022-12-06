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

    const saveMark = () => {
		let el = document.getElementById("defaultCanvas0") as HTMLCanvasElement
		let f : File
		 el.toBlob(blob => {
			if(blob)
				f = new File([blob], "mark.png")
			else
				console.warn("mark blob is empty!", blob)

			setMark(f)
		 })
	}

    const handleNextStage = () => {
        if(stage === 1)
            saveMark()
        let s = stage + 1
        setStage(s)
    }

    return (
        <AirContext>
            <div className="w-full h-screen p-4
                            bg-amber-50 text-amber-900 font-serif leading-relaxed
                            flex items-center justify-center gap-4
                            ">
                <div className="w-full md:w-[720px] h-full
                                flex-grow md:flex-grow-0
                                flex flex-col items-center justify-between md:justify-center gap-8">
                    <div className="w-full h-full flex items-center justify-cente">
                    {
                        stage === 0 ?
                         <WelcomeIntro/>
                        : stage === 1 ? <MarkMaker setMark={setMark} />
                            : stage === 2 ? <SignUp mark={mark}/>
                                    : <>
                                        This stage is too far. We should rather be redirecting you to a created entrypoint
                                    </>
                        }
                    </div>
                {
                    stage < 2 &&
                    <NextButton handleNextStage={handleNextStage}/>
                }
                </div >
            </div>
        </AirContext>
    )
}

export default Welcome