import { FiOctagon } from "react-icons/fi";

function Spinner() {
	return ( 
		<div className="text-7xl text-amber-500 text-center">
			<FiOctagon strokeWidth={1} className="animate-spin"/>
		</div>
	 );
}

export default Spinner;