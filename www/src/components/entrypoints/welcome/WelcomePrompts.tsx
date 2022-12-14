import { useEffect, useState } from "react"
import { getSession } from "../../../utils/auth"
import { TaskDoneType } from "../../../utils/types"
import SubmitButton from "../../commons/buttons/SubmitButton"

interface PromptsInputProps {
    uuid: string,
    setCanUserComplete: Function
}

const WelcomePrompts = ({
    uuid,
    setCanUserComplete,
}: PromptsInputProps) => {
    const session = getSession()
    const [isFormActive, setFormActive] = useState(true)


    const handleSubmission = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        let el = document.getElementById("prompts-preference") as HTMLFormElement
        if(!el)
            return
        let f = new FormData(el)

        const endpoint = new URL(`users/${session.user.uuid}/prompts`, process.env.REACT_APP_API_URL)

        const h = new Headers();
        h.append("Authorization", `Bearer ${session.token}`);

        var options = {
            method: 'PATCH',
            headers: h,
            body: f
        };
        const res = await fetch(endpoint, options)
        if (res.ok) {
            setFormActive(false)
            setCanUserComplete(true)
        } else {
            console.warn('error', res.status)
        }
    }

    return (<>
        <form className="" id="prompts-preference" onSubmit={handleSubmission}>
            <fieldset className="flex flex-col gap-2 flex-items" disabled={!isFormActive}>
                <div>
                    <legend>Pick your prompts frequency:</legend>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <input className="m-1" type="checkbox" id="weekly" name="weekly" />
                    <label htmlFor="weekly">Weekly</label>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <input className="m-1" type="checkbox" id="monthly" name="monthly" />
                    <label htmlFor="monthly">Monthly</label>
                </div>
                <div className="h-12">
                    {
                        isFormActive ? 
                        <SubmitButton onClick={() => handleSubmission}/> 
                            :
                        <p>Thank you!</p>
                    }
                </div>
            </fieldset>
        </form>
    </>)
}

export default WelcomePrompts