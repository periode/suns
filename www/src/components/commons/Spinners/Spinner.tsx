import { FiOctagon } from "react-icons/fi";

function Spinner() {
	return ( 
		<div className="w-10 h-10 text-7xl text-amber-500 text-center">
			<FiOctagon strokeWidth={1} className="animate-spin"/>
		</div>
	 );
}

export default Spinner;