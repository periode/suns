import { ENTRYPOINT_STATUS, IEntrypoint, PARTNER_STATUS } from "../../utils/types"
import { FiShare2, FiArrowRight } from "react-icons/fi"
import React, { useRef } from "react";

interface EntrypointActionsProps {
	ep: IEntrypoint,
	isOwner: boolean,
	canUserComplete: boolean,
	hasUserCompleted: boolean,
	claimEntryPointFunction: () => {},
	handleNext: () => void,
}

function EntrypointActions({
	ep,
	claimEntryPointFunction,
	handleNext,
	isOwner,
	canUserComplete,
	hasUserCompleted
}: EntrypointActionsProps) {
	const hasClicked = useRef(false)

	const copyToClipboard = (text: string) => {
		window.prompt("You can share this link: ", text);
	}

	const handleNextClick = (e: React.BaseSyntheticEvent) => {
		e.target.setAttribute('disabled', true)
		if(hasClicked.current === false){
			hasClicked.current = true
			handleNext()
		}
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
			onClick={ () => {claimEntryPointFunction()}}>
			<p>Start</p>
			<FiArrowRight className="text-xs" />
		</button>

	const NextButton =
		<button className={`font-mono
							cursor-pointer
							flex items-center
							gap-1`}
			onClick={handleNextClick}>
			<p>Next</p>
			<FiArrowRight className="text-xs" />
		</button>

	const FinishButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={handleNextClick}>
			<p>Finish</p>
			<FiArrowRight className="text-xs" />
		</button>

	const Step =
		<p className=" 	w-full h-full
					flex items-center justify-center
					text-center  font-mono
					opacity-50">
			{ep.current_module + 1} / {ep.modules.length}
		</p>

	const rightButtonDisplay = () => {
		if (!isOwner && (ep.partner_status === PARTNER_STATUS.PartnerPartial || ep.partner_status === PARTNER_STATUS.PartnerNone))
			return StartButton

		if (hasUserCompleted)
			return <></>

		if (isOwner && canUserComplete && ep.status === ENTRYPOINT_STATUS.EntrypointPending) {
			if (ep.current_module === ep.modules.length - 2)
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
			{Step}
			<div className="w-16">
				{ rightButtonDisplay() }
			</div>
		</div>
	);
}

export default EntrypointActions;