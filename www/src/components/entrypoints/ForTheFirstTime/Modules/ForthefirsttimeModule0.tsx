import { useContext } from "react";
import { AirTableContext } from "../../../../contexts/AirContext";


interface ForthefirsttimeModule0Props {
	setCompleted : () => {}
}



const ForthefirsttimeModule0 = ({  } : ForthefirsttimeModule0Props) => {

	const airtable = useContext(AirTableContext)

	return ( 
		<>
			{ airtable.get("ForTheFirstTime")?.get("EntryPoint0Name") }
			{ airtable.get("ForTheFirstTime")?.get("EntryPoint0module0Video") }
			{ airtable.get("ForTheFirstTime")?.get("EntryPoint0module0Text") }
		</>
	 );
}

export default ForthefirsttimeModule0 ;