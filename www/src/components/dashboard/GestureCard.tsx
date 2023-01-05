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
			<div className="w-full p-3
							text-amber-900/50
							border-2 border-amber-900/50 rounded-[4px]
						 	flex items-center justify-between">
				<div className="flex items-center gap-2 text-lg">
					<div className="text-2xl w-6 h-6 flex items-center justify-center">
						<FiCheck/>
					</div>
					<p>{name}</p>
				</div>
				<div className="text-2xl">
					<FiArrowRight/>
				</div>

			</div>)
	else if (status === OWNED_ENTRYPOINT_STATUS.OwnedEntrypointActionable)
		return (
			<div className="w-full p-3
							text-amber-500
							border-2 border-amber-500 rounded-[4px]
						 	flex items-center justify-between">
				<div className="flex items-center gap-2 text-lg">
					<div className="text-2xl w-6 h-6 flex items-center justify-center">
						<div className="h-2 w-2 rounded-full bg-amber-500"></div>
					</div>
					<p>{name}</p>
				</div>
				<div className="text-2xl">
					<FiArrowRight/>
				</div>
			</div>
		);
	else if (status === OWNED_ENTRYPOINT_STATUS.OwnedEntrypointWaiting)
		return (
			<div className="w-full p-3
							text-stone-500
							border-2 border-stone-500 rounded-[4px]
						 	flex items-center justify-between">
				<div className="flex items-center gap-2 text-lg">
					<div className="text-2xl w-6 h-6 flex items-center justify-center">
						<FiClock/>
					</div>
					<p>{name}</p>
				</div>
				<FiArrowRight/>
			</div>
	);
	else return <>There was a problem making this gesture card</>
}

export default GestureCard;