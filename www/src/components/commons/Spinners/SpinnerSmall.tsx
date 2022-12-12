import { FiOctagon } from "react-icons/fi";

function SpinnerSmall() {
	return ( 
		<div className="w-10 h-10 
		 animate-slowspin">
			<FiOctagon 
				className="w-full h-full" 
				strokeWidth={1}/>
		</div>
	 );
}

export default SpinnerSmall