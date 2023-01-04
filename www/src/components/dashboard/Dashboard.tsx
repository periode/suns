
import { useState } from "react";
import { FiActivity } from "react-icons/fi";

import EngineState from "../commons/menu/EngineState";
import { IEntrypoint, ISession } from "../../utils/types";
import MenuBar from "../commons/menu/MenuBar";

interface DashboardProps { 
	entrypoints: Array<IEntrypoint>,
	session: ISession
}

function Dashboard(
	{ 
		entrypoints,
		session
	} : DashboardProps
) {
	const [isCollapsed, setIsCollapsed] = useState(false)


	return ( 
	<>
		{
			!isCollapsed ?
				<div className="absolute z-[5]
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
			:
				<div className="absolute z-10
									w-full h-full
									bg-amber-100
									">
						<MenuBar onClick={() => setIsCollapsed(false)}>
							<></>
						</MenuBar>
						
				</div>
			}
	</>
);	
}

export default Dashboard;