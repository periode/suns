import { ENTRYPOINT_STATUS, IEntrypoint, PARTNER_STATUS } from "../../utils/types"
import { FiShare2, FiArrowRight } from "react-icons/fi"
import React, { useEffect, useRef } from "react";
import SpinnerSmall from "../commons/Spinners/SpinnerSmall";

interface EntrypointActionsProps {
	ep: IEntrypoint,
	isOwner: boolean,
	canUserComplete: boolean,
	hasUserCompleted: boolean,
	claimEntryPointFunction: () => {},
	handleNext: () => void,
	isFetching: boolean
}

function EntrypointActions({
	ep,
	claimEntryPointFunction,
	handleNext,
	isOwner,
	canUserComplete,
	hasUserCompleted,
	isFetching
}: EntrypointActionsProps) {
	const nextButtonRef = useRef<HTMLButtonElement>(null)
	const hasClicked = useRef(false)

	useEffect(() => {
		if (canUserComplete && nextButtonRef.current)
			nextButtonRef.current.disabled = false

		if(canUserComplete && hasClicked.current)
			hasClicked.current = false
	}, [canUserComplete, ep])

	const shareEntrypoint = async (url: string) => {
		try {
			const shareData = {
				title: "The sun sets 194 times",
				text: "Join me in completing this gesture point!",
				url: url
			}
			await navigator.share(shareData);
		} catch (error) {
			window.prompt("You can share this link: ", url);
		}
	}

	const handleNextClick = (e: React.BaseSyntheticEvent) => {
		if (nextButtonRef.current)
			nextButtonRef.current.setAttribute('disabled', "true")

		if(!hasClicked.current){
			hasClicked.current = true
			handleNext()
		}
	}

	const ShareButton =
		<button className=" font-mono italic
							cursor-pointer
							flex items-center
							gap-1"
			onClick={() => { shareEntrypoint(window.location.href) }}>
			<FiShare2 className="text-xs" />
			<p>Share</p>
		</button>

	const StartButton =
		<button className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
			onClick={() => { claimEntryPointFunction() }}>
			<p>Start</p>
			<FiArrowRight className="text-xs" />
		</button>

	const NextButton =
		<button ref={nextButtonRef} className={`font-mono italic
							cursor-pointer
							flex items-center
							gap-1 disabled:opacity-50`}
			onClick={handleNextClick}>
			<p>{ep.current_module === ep.modules.length - 2 ? "Finish" : "Next"}</p>
			<FiArrowRight className="text-xs" />
		</button>

	const Step =
		<p className=" 	w-full h-full
					flex items-center justify-center
					text-center  font-mono text-sm
					opacity-50">
			{ep.current_module + 1} / {ep.modules.length}
		</p>

	const rightButtonDisplay = () => {
		if (isFetching)
			return <SpinnerSmall/>
		if (!isOwner && (ep.partner_status === PARTNER_STATUS.PartnerPartial || ep.partner_status === PARTNER_STATUS.PartnerNone))
			return StartButton

		if (hasUserCompleted)
			return <></>

		if (isOwner && canUserComplete && ep.status === ENTRYPOINT_STATUS.EntrypointPending) {
			return NextButton
		}

		return <></>
	}


	return (
		
		<div className="w-full flex items-center justify-between text-sm italic">
			<div className="w-16">

				{ShareButton}
			</div>

			{
				ep.current_module + 1 !== ep.modules.length &&
				Step
			}
			<div className="w-16">
				{rightButtonDisplay()}
			</div>
		</div>
	);
}

export default EntrypointActions;