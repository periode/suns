import { FiOctagon } from "react-icons/fi";

function SubmittingContent() {
	return ( 
		<div className="w-8 h-8 
		 animate-slowspin">
			<FiOctagon 
				className="w-full h-full" 
				strokeWidth={1}/>
		</div>
	 );
}

export default SubmittingContent