
import { useState } from "react";

import { FiActivity, FiArrowRight, FiDroplet, FiSmile, FiTarget, FiZap } from "react-icons/fi";
import { TbChartCircles } from "react-icons/tb";
import { IoFootstepsOutline } from "react-icons/io5";

import EngineState from "../commons/menu/EngineState";
import { ENTRYPOINT_STATUS, IEntrypoint, ISession } from "../../utils/types";
import MenuBar from "../commons/menu/MenuBar";
import GestureList from "./GestureList";
import { useNavigate } from "react-router-dom";
import SacrificeState from "../commons/menu/SacrificeState";

interface DashboardProps { 
	entrypoints: Array<IEntrypoint>,
	session: ISession
}

interface ICluster {
	name: string,
	icon: any,
}

function Dashboard(
	{ 
		entrypoints,
		session
	} : DashboardProps
) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const checkOwnership = (entrypoint: IEntrypoint): boolean => { 
		for (var i = 0; i < entrypoint.users.length; i++)
			if (entrypoint.users[i].uuid === session.user.uuid)
				return true
		return false
	}

	const navigate = useNavigate()

	const listedClusters : ICluster[] = [
		{
			name: "Cracks", 
			icon: <FiZap/>
		},
		{
			name: "Drought", 
			icon: <FiDroplet/>
		},
		{
			name: "Combining First Times", 
			icon: <FiTarget/>
		},
		{
			name: "Footprints", 
			icon: <IoFootstepsOutline/>
		},
		{
			name: "Prompts", 
			icon: <FiSmile/>
		},
		{
			name: "Symbiosis", 
			icon: <TbChartCircles/>
		}
	]

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
									w-full h-full md:w-96 
									right-0 top-0
									md:border-l border-amber-900
									">
					<div className="w-full min-h-full flex flex-col bg-amber-100">
						<MenuBar onClick={() => setIsCollapsed(false)}></MenuBar>
							<div className="w-full flex flex-col gap-8 mt-16 p-4 text-amber-900">
								<div>
									<h2 className="w-full mb-2">Gestures</h2>
									<div className="w-full flex flex-col gap-8">
										{
											listedClusters.map((cluster, index) => {
												return (
													<GestureList key={index} name={cluster.name} icon={cluster.icon} session={session} entrypoints={
														entrypoints.filter((entrypoint) =>
															entrypoint.cluster.name === cluster.name
															&& checkOwnership(entrypoint)
															&& entrypoint.status !== ENTRYPOINT_STATUS.EntrypointSacrificed
														)
													}/>
												)
											})
										}
									</div>
								</div>
								<SacrificeState/>
								{
									session.user.debug_account &&	
									<div>
										<h2 className="w-full mb-2">Debug</h2>
											<EngineState/>	
									</div>
								}	
						</div>
					</div>
				</div>
			}
	</>
);	
}

export default Dashboard;