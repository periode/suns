import { ReactElement, useEffect, useState } from "react";
import { FiAlertOctagon, FiCheck  } from "react-icons/fi"
import { IconType } from "react-icons/lib";
export enum ToasterType {
	success,
	error,
	neutral
}

interface ToasterProps {
	type? : ToasterType,
	message: string,
	display: boolean,
	timeoutms?: number,
}

const Toaster = ({ type, message, display, timeoutms } : ToasterProps) => {
	 
	const [displayed, setDisplayed] = useState(display)

	useEffect(() => {
		console.log("display: " + display)
		if (timeoutms && display)
		{
			setDisplayed(true)
			const timeoutDisplay = setTimeout(() => { 	
				console.log("ho")
				setDisplayed(false) 
			}, timeoutms);
			return (() => clearTimeout(timeoutDisplay));
		}
	}, [display, timeoutms])

	if (!displayed)
		return <></>

	var content : ReactElement

	switch (type) {
		case ToasterType.success:
			content = 
				<div>
					<div className="
						m-4 p-4 border border-1 border-green-500 bg-green-500/20 text-green-500
						flex gap-2 items-center
						font-serif 
						"
					>
					<FiCheck className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			break;
		case ToasterType.error:
			content = 
				<div>
					<div className="
						m-4 p-4 border border-1 border-red-500 bg-red-500/20 text-red-500
						flex gap-2 items-center
						font-serif
						"
					>
					<FiAlertOctagon className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			break;
		default:
			content = 
				<div>
					<div className="
						m-4 p-4 border border-1 border-stone-500 bg-stone-500/20 text-stone-500
						flex gap-2 items-center
						font-serif font-semibold
						"
					>
					<FiAlertOctagon className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			break;
	}
	return (
		displayed ? 
		<div className="absolute z-100
						animate-bounce">
			{ content }
		</div>
		:
		<>
		</>
	)
}

export default Toaster;