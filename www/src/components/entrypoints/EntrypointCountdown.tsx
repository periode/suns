import { useCountdown } from "../../hooks/useCountdown";

interface EntrypointCountdownProps {
	endDate : string
}

function EntrypointCountdown( {endDate} : EntrypointCountdownProps ) {
	const [days, hours, minutes, seconds] = useCountdown(endDate)

	const doubleDigits = (digit : number) : string =>{
		if (digit < 10)
			return (String("0" + digit))
		return(String(digit))
	}
	return ( 
		<div className="w-full h-12 
						flex items-center justify-center
						font-mono
						border-b border-amber-800
						">
			{
				days + " : " + 
				doubleDigits(hours) + " : " + 
				doubleDigits(minutes) + " : " + 
				doubleDigits(seconds)
			}
		</div>
	 );
}

export default EntrypointCountdown;