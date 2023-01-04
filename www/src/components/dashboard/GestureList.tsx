import { ENTRYPOINT_STATUS, IEntrypoint, ISession, OWNED_ENTRYPOINT_STATUS } from "../../utils/types";
import GestureCard from "./GestureCard";

interface GestureListProps {
	name: string,
	entrypoints: IEntrypoint[],
	session: ISession
 }

function GestureList({
	name,
	entrypoints,
	session
}: GestureListProps) {


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
		<div className="w-full">
			<h3>{name}</h3>
			<div className="w-full flex flex-col">
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