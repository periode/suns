import { useCountdown } from "../../hooks/useCountdown";

interface EntrypointCountdownProps {
	endDate : string
}

function EntrypointCountdown( {endDate} : EntrypointCountdownProps ) {
	const [days, hours, minutes, seconds] = useCountdown(endDate)
	return ( 
		<div className="w-full h-12 
						flex items-center justify-center
						font-mono
						border-b border-amber-800
						">
			{
				days + " : " + 
				hours + " : " + 
				minutes + " : " + 
				seconds
			}
		</div>
	 );
}

export default EntrypointCountdown;