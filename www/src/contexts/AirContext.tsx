import Airtable from "airtable"
import React, {createContext, useEffect, useState} from "react"

interface AirContextProps {
	children : React.ReactNode;
}

interface IRecord {
	// Interface fprr name : value
	[ key: string ]: string
}

const AirTableContext = createContext<IRecord[]>([])

const AirContext = ({children} : AirContextProps) => {
	

	const [mainContext, setMainContext] = useState<IRecord[]>([])


	useEffect(() => {
		Airtable.configure({
			endpointUrl: 'https://api.airtable.com',
			apiKey: process.env.REACT_APP_AIRTABLE_KEY
		})
		var base = Airtable.base('appO4245S69TqEnGW');
	
		const nameOfSpreadsheet = 'Main'
		base(nameOfSpreadsheet).select().eachPage(function page(records, fetchNextPage) {
			// This function (`page`) will get called for each page of records.
	
	
			records.forEach(function(record) {
				const newElement : IRecord = { name: String(record.get('Name')), content: String(record.get('Content'))}
				setMainContext(oldArray => [...oldArray,  newElement])
			});
			// To fetch the next page of records, call `fetchNextPage`.
			// If there are more records, `page` will get called again.
			// If there are no more records, `done` will get called.
			fetchNextPage();
	
		}, function done(err) {
			if (err) { console.error(err); return; }
		});
		console.log(mainContext)
	}, [mainContext])

	return ( 
		<AirTableContext.Provider value={mainContext}>
			{ children }
		</AirTableContext.Provider> );
}

export default AirContext;