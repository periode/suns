import { useEffect } from "react";
import { useCountdown } from "../../../../hooks/useCountdown"


interface AudioRecorderCountdownProps {
	time: number;
}

function AudioRecorderCountdown( { time } : AudioRecorderCountdownProps ) {

	const date = Date.now()
	const EndDate = new Date(date + time)

	const [days, hours, minutes, seconds] = useCountdown(EndDate.toDateString())

	const doubleDigits = (digit : number) : string =>{
		if (digit < 10)
			return (String("0" + digit))
		return(String(digit))
	}

	return ( 
		<div className="font-mono">
			{
				doubleDigits(minutes) + " : " + 
				doubleDigits(seconds)
			}
		</div>
	 );
}

export default AudioRecorderCountdown;