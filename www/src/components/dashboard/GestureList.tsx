import { ENTRYPOINT_STATUS, IEntrypoint, OWNED_ENTRYPOINT_STATUS } from "../../utils/types";
import GestureCard from "./GestureCard";

interface GestureListProps {
	name: string,
	entrypoints: IEntrypoint[],
 }

function GestureList({
	name,
	entrypoints
}: GestureListProps) {


	const getOwnedStatus = (entrypoint: IEntrypoint): OWNED_ENTRYPOINT_STATUS => { 

		if (entrypoint.status === ENTRYPOINT_STATUS.EntrypointCompleted)
			return OWNED_ENTRYPOINT_STATUS.OwnedEntrypointCompleted
		
		
		
		var hasUserCompleted : boolean
		
		if (entrypoint.max_users === 1 )
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