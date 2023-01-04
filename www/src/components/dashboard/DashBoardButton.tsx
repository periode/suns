import { useState } from "react";
import { FiActivity } from "react-icons/fi";

function DashboardButton() {
	const [isCollapsed, setIsCollapsed] = useState(false)
	return ( 
		<div className="absolute z-10
						w-16 h-16 
						right-4 bottom-4">
			<button className="w-full h-full 
							bg-amber-100 shadow-lg rounded-[0.25rem]
							flex items-center justify-center
							text-amber-500 text-3xl"
					onClick={() => setIsCollapsed(!isCollapsed)}
			>
				<FiActivity/>
			</button>
		</div>
	 );
}

export default DashboardButton;