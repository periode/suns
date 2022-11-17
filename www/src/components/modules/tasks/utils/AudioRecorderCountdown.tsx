import { useEffect, useState } from "react";
import { useCountdown } from "../../../../hooks/useCountdown"


interface AudioRecorderCountdownProps {
	time: number;
}

function AudioRecorderCountdown( { time } : AudioRecorderCountdownProps ) {

	const EndDate = new Date(Date.now() + time)
	
	const [date, setDate] = useState(EndDate.toString())

	const [days, hours, minutes, seconds] = useCountdown(date)

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