import { ENTRYPOINT_STATUS, IEntrypoint, ISession, IUser, PARTNER_STATUS } from "../../utils/types"
import { FiShare2, FiArrowRight } from "react-icons/fi"

interface EntrypointActionsProps {
	entryPointData: IEntrypoint,
	isOwner: boolean,
	canUserComplete: boolean,
	hasUserCompleted: boolean,
	claimEntryPointFunction: () => {},
	completeModuleFunction: () => void,
}

function EntrypointActions({
	entryPointData,
	claimEntryPointFunction,
	completeModuleFunction,
	isOwner,
	canUserComplete,
	hasUserCompleted
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
							gap-1`}
			onClick={() => { if (!hasUserCompleted) completeModuleFunction() }} disabled={hasUserCompleted}>
			<p>Next</p>
			<FiArrowRight className="text-xs" />
		</button>

	const FinishButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={() => completeModuleFunction()}>
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
		if (!isOwner && (entryPointData.partner_status === PARTNER_STATUS.PartnerPartial || entryPointData.partner_status === PARTNER_STATUS.PartnerNone))
			return StartButton

		if (hasUserCompleted)
			return <></>

		if (isOwner && canUserComplete && entryPointData.status === ENTRYPOINT_STATUS.EntrypointPending) {
			if (entryPointData.current_module === entryPointData.modules.length - 2)
				return FinishButton
			else
				return NextButton
		}

		return <></>
	}


	return (
		<div className="w-full flex items-center justify-between">
			<div className="w-16">

				{ShareButton}
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