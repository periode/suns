import { ENTRYPOINT_STATUS, IEntrypoint, IUser, PARTNER_STATUS } from "./Entrypoint"
import { FiShare2, FiArrowRight } from "react-icons/fi"

interface EntrypointActionsProps {
	entryPointData: IEntrypoint,
	isOwner: boolean,
	session: Object,
	isUserComplete: boolean,
	claimEntryPointFunction: () => {},
	completeModuleFunction: (data: any, session: Object) => Promise<void>,
}

function EntrypointActions({
	entryPointData,
	claimEntryPointFunction,
	completeModuleFunction,
	isOwner,
	session,
	isUserComplete
}: EntrypointActionsProps) {

	const copyToClipboard = (text: string) => {
		window.prompt("You can share this link: ", text);
	}

	const ShareButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={() => { copyToClipboard(window.location.href) }}>
			<FiShare2 className="text-xs" />
			<p>Share</p>
		</button>

	const StartButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={claimEntryPointFunction}>
			<p>Start</p>
			<FiArrowRight className="text-xs" />
		</button>

	const NextButton =
		<button className={`font-mono
							cursor-pointer
							flex items-center
							gap-1 ${isUserComplete ? '': 'opacity-50'}`}
			onClick={() => completeModuleFunction(entryPointData, session)} disabled={!isUserComplete}>
			<p>Next</p>
			<FiArrowRight className="text-xs" />
		</button>

	const FinishButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={() => completeModuleFunction(entryPointData, session)}>
			<p>Finish</p>
			<FiArrowRight className="text-xs" />
		</button>

	const Step = 
	<p className=" 	w-full h-full
					flex items-center justify-center
					text-center  font-mono
					opacity-50">
			{entryPointData.current_module + 1} / {entryPointData.modules.length}
		</p>

	const rightButtonDisplay = () => {
		if (entryPointData.status === ENTRYPOINT_STATUS.EntrypointPending && isOwner) {
			if (entryPointData.current_module === entryPointData.modules.length - 2 && isUserComplete)
				return FinishButton
			else if(entryPointData.partner_status == PARTNER_STATUS.PartnerFull && isUserComplete)
				return NextButton
			else
				return <></>
		}
		else {
			if (entryPointData.status === ENTRYPOINT_STATUS.EntrypointOpen || entryPointData.status === ENTRYPOINT_STATUS.EntrypointPending)
				return StartButton
			else
				return <></>
		}
	}


	return ( 
	<div className="w-full flex items-center justify-between">
		<div className="w-16">
			
			{ ShareButton } 
		</div>
		{	
			entryPointData.status === ENTRYPOINT_STATUS.EntrypointPending && isOwner &&
				Step 
		}
		<div className="w-16">
			{ rightButtonDisplay() }
		</div>
	</div> 
	);
}

export default EntrypointActions;