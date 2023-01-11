import { useEffect, useRef, useState } from "react";
import { FiArrowDownRight, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCountdown } from "../../../hooks/useCountdown";

interface SacrificeStatus {
    generation: number,
    sacrifice_wave: number,
    sacrifice_time: number
}

function SacrificeState() {

	const navigate = useNavigate()

	const hasState = useRef(false)
    const [engineState, setEngineState] = useState<SacrificeStatus>({generation: 0, sacrifice_wave: 0, sacrifice_time: -1})

	const [days, hours, minutes, seconds] = useCountdown(String(new Date(engineState.sacrifice_time * 1000)))

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
                .then((data : SacrificeStatus) => {
                    console.log(`current state:\n${JSON.stringify(data)}`)
                    setEngineState(data)
                })
        }
    }, [])

	const doubleDigits = (digit : number) : string =>{
		if (digit.toString().length === 1)
			return (String("0" + digit))
		else if(digit < 0)
			return("00")
		return(String(digit))
	}

	return ( 
		<div>
			<div className="flex items-center justify-between mb-2">
				<h2 className="w-full">Sacrifices</h2>
				{
					(engineState?.sacrifice_wave > 0) &&
					<button
					className="flex items-center gap-1 text-xs font-mono pl-2 pr-2 pt-1 pb-1 rounded-sm border border-amber-900"
					onClick={() => {  navigate(`/entrypoints/archive/sacrifice`, { replace: true }) }}>Museum<FiArrowRight/>
					</button>
				}
			</div>
			<div className="w-full flex flex-col">
			{
				(engineState?.sacrifice_time < 0) ?
				<div className="w-full h-12 flex items-center justify-center rounded-sm bg-amber-900/10 font-mono">
							<p className="text-xs text-center opacity-50">No sacrifice is expected soon</p>	
						</div>
						:
						<div className="w-full h-12 flex items-center justify-center rounded-sm bg-red-600/20 text-red-600 font-mono">
							<p className=" text-center">
							{
								isNaN(days) ? '-- : -- : -- : --' :
								days + " : " + 
								doubleDigits(hours) + " : " + 
								doubleDigits(minutes) + " : " + 
								doubleDigits(seconds)
							}
							</p>
						</div>
			}
			{
				engineState?.sacrifice_wave > 0 &&
				<button
				className="w-full p-4 text-xs font-mono"
				onClick={() => {  navigate(`/entrypoints/archive/sacrifice`, { replace: true }) }}>Museum of the sacrificed <FiArrowRight/>
				</button>
			}
			</div>
		</div>
	 );
}

export default SacrificeState;