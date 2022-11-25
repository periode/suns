import { useEffect, useState } from "react"
import { getSession } from "../../../utils/auth"

interface PromptsInputProps {
    handleUserDone: Function,
}

const WelcomePrompts = ({
    handleUserDone,
}: PromptsInputProps) => {
    const session = getSession()
    const [isFormActive, setFormActive] = useState(true)

    useEffect(() => {
        handleUserDone(false)
    }, [])

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
            handleUserDone(true)
            setFormActive(false)
        } else {
            console.warn('error', res.status)
        }
    }

    return (<>
        <form id="prompts-preference">
            <fieldset disabled={!isFormActive}>
                <legend>Pick your prompts frequency:</legend>

                <div>
                    <input className="m-1" type="checkbox" id="weekly" name="weekly" />
                    <label htmlFor="weekly">Weekly</label>
                </div>

                <div>
                    <input className="m-1" type="checkbox" id="monthly" name="monthly" />
                    <label htmlFor="monthly">Monthly</label>
                </div>
                <button className="border p-1" type="button" onClick={handleSubmission}>Submit</button>
            </fieldset>
        </form>
    </>)
}

export default WelcomePrompts