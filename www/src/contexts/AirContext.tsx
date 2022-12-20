import Airtable from "airtable"
import React, {createContext, useEffect, useRef, useState} from "react"
import LoadingApp from "../components/commons/loading/LoadingApp"


const AirTablePages : string[] = [
	"Main",
	"CombiningFirstTimes",
	"SymbiosisGaze",
	"SymbiosisTask",
	"SymbiosisMean",
	"FootprintsPerson",
	"FootprintsObject",
	"FootprintsPlace",
	"DraughtYou",
	"DraughtWorld",
	"DraughtPersonal",
	"Cracks",
	"Welcome",
	"PublicView",
	"Sacrifice"
]

var AirTableMap = new Map<string, Map<string, string>>()

export const AirTableContext = createContext(AirTableMap)

interface AirContextProps {
	children : React.ReactNode;
}



const AirContext = ({children} : AirContextProps) => {
	
	const [mainContext, setMainContext] = useState(AirTableMap)
	const [isLoading, setIsLoading] = useState(false)


	const renderOnce = useRef(false)

	useEffect(() => {
		if (renderOnce.current === true)
			return
		setIsLoading(true)
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
				setIsLoading(false)
				if (err) { console.error(err); return; }
			})
		});
		renderOnce.current = true
	}, [mainContext])

	return ( 
		<>
		{
			isLoading ? 
			<LoadingApp/>
			:
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