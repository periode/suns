import Airtable from "airtable"
import React, {createContext, useEffect, useRef, useState} from "react"


const AirTablePages : string[] = [
	"Main",
	"ForTheFirstTime",
]

var AirTableMap = new Map<string, Map<string, string>>()

export const AirTableContext = createContext(AirTableMap)

interface AirContextProps {
	children : React.ReactNode;
}



const AirContext = ({children} : AirContextProps) => {
	
	const [mainContext, setMainContext] = useState(AirTableMap)


	const renderOnce = useRef(false)

	useEffect(() => {
		console.log ("Calling use effect")
		if (renderOnce.current === true)
			return
		Airtable.configure({
			endpointUrl: 'https://api.airtable.com',
			apiKey: process.env.REACT_APP_AIRTABLE_KEY
		})
		var base = Airtable.base('appO4245S69TqEnGW');
		
		AirTablePages.forEach( pageName => {
			base(pageName).select().eachPage(function page(records, fetchNextPage) {
				
				var newMap = new Map();
				records.forEach( (record) => {
					var Name = 		String(record.get('Name'))
					var Content = 	String(record.get('Content'))
					if (Name && Content)
						newMap.set(Name, Content)
				})
				setMainContext(new Map(mainContext.set(pageName, newMap)))
				fetchNextPage();
			}, function done(err) {
				if (err) { console.error(err); return; }
			})
		});
		renderOnce.current = true
	}, [mainContext])
	
	useEffect(() => {
		console.log("mainContext: ", mainContext)
	}, [mainContext])

	return ( 
		<>
		{
			mainContext ? 
			<AirTableContext.Provider value={mainContext}>
				{ children }
			</AirTableContext.Provider> 
			: 
			{ children }
		}
		</>

		);
}

export default AirContext;