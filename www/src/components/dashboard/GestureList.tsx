import { IconBase, IconType } from "react-icons";
import { ENTRYPOINT_STATUS, IEntrypoint, ISession, OWNED_ENTRYPOINT_STATUS } from "../../utils/types";
import GestureCard from "./GestureCard";
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

interface GestureListProps {
	name: string,
	entrypoints: IEntrypoint[],
	session: ISession,
	icon: any
 }

function GestureList({
	name,
	entrypoints,
	session,
	icon
}: GestureListProps) {

	const [isCollapsed, setIsCollapsed] = useState(false)

	const getOwnedStatus = (entrypoint: IEntrypoint): OWNED_ENTRYPOINT_STATUS => { 

		if (entrypoint.status === ENTRYPOINT_STATUS.EntrypointCompleted)
			return OWNED_ENTRYPOINT_STATUS.OwnedEntrypointCompleted
		
		var hasUserCompleted: boolean = false
		
		// Since user_completed is being reset to [0, 0] every time the module is completed, we don't need to check for the partner since it can never be [1,1]
		for (var i = 0; i < entrypoint.users.length; i++)
			if (entrypoint.users[i].uuid === session.user.uuid
				&& entrypoint.user_completed[i] === 1)
				hasUserCompleted = true
		
		
		if (entrypoint.max_users === 1 || !hasUserCompleted)
			return OWNED_ENTRYPOINT_STATUS.OwnedEntrypointActionable
		else
			return OWNED_ENTRYPOINT_STATUS.OwnedEntrypointWaiting
	}

	return (
		<div className="w-full ">
			<div className="flex items-center justify-between
							text-2xl	"
				onClick={() => setIsCollapsed(!isCollapsed)}>
				<div className="flex items-center gap-2">
					<div className="text-3xl">
						{ icon }
					</div>
					<h3>{name}</h3>
				</div>
				{
					entrypoints.length === 0 ?
					<></>
					: !isCollapsed ?
					<FiChevronDown />
					:
					<FiChevronUp/>
				}
			</div>
			<div className="w-full flex flex-col mt-4 gap-2">
			{
				entrypoints.map((entrypoint, index) => { 
					return (
						<GestureCard
							key={index}
							name={entrypoint.name}
							url={entrypoint.uuid}
							status={
								getOwnedStatus(entrypoint)
							}	
						/>
					)
				})
				
			}
			</div>
		</div>
	);
}

export default GestureList;