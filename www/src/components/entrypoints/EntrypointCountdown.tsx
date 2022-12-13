import { useCountdown } from "../../hooks/useCountdown";

interface EntrypointCountdownProps {
	endDate : string
}

function EntrypointCountdown( {endDate} : EntrypointCountdownProps ) {
	const [days, hours, minutes, seconds] = useCountdown(endDate)

	const doubleDigits = (digit : number) : string =>{
		if (digit.toString().length === 1)
			return (String("0" + digit))
		else if(digit < 0)
			return(String(0))
		return(String(digit))
	}
	
	return ( 
		<div className="w-full h-12 
						flex-1
						flex items-center justify-center
						font-mono text-sm
						">
			{
				isNaN(days) ? '-- : -- : -- : --' :
				days + " : " + 
				doubleDigits(hours) + " : " + 
				doubleDigits(minutes) + " : " + 
				doubleDigits(seconds)
			}
		</div>
	 );
}

export default EntrypointCountdown;