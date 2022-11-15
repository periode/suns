import { ReactElement } from "react";
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
	display: boolean
}

const Toaster = ({ type, message, display } : ToasterProps) => {
	 
	var color : string;
	var icon : ReactElement;

	if (!display)
		return <></>

	switch (type) {
		case ToasterType.success:
			return(
				<div>
					<div className="
						absolute m-4 p-4 border border-1 border-green-500 bg-green-500/20 text-green-500
						flex gap-2 items-center
						font-mono text-sm
						z-100"
					>
					<FiCheck className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			);
		case ToasterType.error:
			return(
				<div>
					<div className="
						absolute m-4 p-4 border border-1 border-red-500 bg-red-500/20 text-red-500
						flex gap-2 items-center
						font-mono text-sm
						z-100"
					>
					<FiAlertOctagon className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			);
		default:
			return(
				<div>
					<div className="
						absolute m-4 p-4 border border-1 border-stone-500 bg-stone-500/20 text-stone-500
						flex gap-2 items-center
						z-100"
					>
					<FiAlertOctagon className="text-xl"/>
					<p>
						{ message }
					</p>
					</div>
				</div>
			);
		
	}
}

export default Toaster;