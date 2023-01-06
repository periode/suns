import { useEffect, useRef, useState } from "react";

interface EngineState {
    generation: number,
    sacrifice_wave: number,
    sacrifice_time: number
}

const EngineState = () => {
    const hasState = useRef(false)
    const [engineState, setEngineState] = useState<EngineState>({generation: 0, sacrifice_wave: 0, sacrifice_time: -1})

    useEffect(() => {
        const endpoint = new URL('engine/state', process.env.REACT_APP_API_URL)

        if (hasState.current === false) {
            hasState.current = true;
            fetch(endpoint)
                .then(res => {
                    if (res.ok)
                        return res.json()
                    else
                        console.warn("GET engine state:", res.statusText)
                })
                .then((data : EngineState) => {
                    console.log(`current state:\n${JSON.stringify(data)}`)
                    setEngineState(data)
                })
        }
    }, [])

    return (
    <div className="font-mono text-sm">
        <ul>
            <li>We have created {engineState?.generation} generations of gesture points.</li>
            <li>{engineState?.sacrifice_time < 0 ? "No sacrifice is expected soon." : `A sacrifice is expected on ${new Date(engineState.sacrifice_time * 1000)}`}</li>
            <li>There has been {engineState?.sacrifice_wave} sacrifice(s).</li>
        </ul>
    </div>)
}

export default EngineState;