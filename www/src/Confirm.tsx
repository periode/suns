import { useState } from "react";
import Spinner from "./components/commons/Spinner";


const Confirm = () => {
	const [confirming, setConfirming] = useState(true);
	return ( 
		<>
			confirming ? 
			<>
				<Spinner/>
			</>
			:
			<>
			</>
		</>
	 );
}

export default Confirm;