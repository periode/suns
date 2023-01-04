import { FiArrowRight, FiCheck, FiClock } from "react-icons/fi";
import { OWNED_ENTRYPOINT_STATUS } from "../../utils/types";

interface GestureCardProps {
	name: string,
	url: string,
	status: OWNED_ENTRYPOINT_STATUS
}

function GestureCard(
	{ 
		name,
		url,
		status
	} : GestureCardProps
) {
	if (status === OWNED_ENTRYPOINT_STATUS.OwnedEntrypointCompleted)
		return (
			<div className="w-full rounded-sm
						 	flex items-center justify-between">
				<div className="flex items-center ">
					<FiCheck/>
					<p>{name}</p>
				</div>
				<FiArrowRight/>

			</div>)
	else if (status === OWNED_ENTRYPOINT_STATUS.OwnedEntrypointActionable)
		return (
			<div className="w-full rounded-sm
						 	flex items-center justify-between">
				<div className="flex items-center ">
					<FiClock/>
					<p>{name}</p>
				</div>
				<FiArrowRight/>
			</div>
		);
	else if (status === OWNED_ENTRYPOINT_STATUS.OwnedEntrypointWaiting)
		return (
			<div className="w-full rounded-sm
						 	flex items-center justify-between">
				<div className="flex items-center ">
					<div className="h-2 w-2 rounded-full"></div>
					<p>{name}</p>
				</div>
				<FiArrowRight/>
			</div>
	);
	else return <>There was a problem making this gesture card</>
}

export default GestureCard;