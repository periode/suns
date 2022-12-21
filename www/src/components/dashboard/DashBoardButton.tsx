import { useState } from "react";
import { FiActivity } from "react-icons/fi";

function DashboardButton() {
	const [isCollapsed, setIsCollapsed] = useState(false)
	return ( 
		<div className="fixed w-16 h-16 right-4 bottom-4">
			<div className="w-full h-full 
						bg-amber-100 shadow-sm rounded-[0.25rem]
						flex items-center justify-center">
				<FiActivity/>
			</div>
		</div>
	 );
}

export default DashboardButton;