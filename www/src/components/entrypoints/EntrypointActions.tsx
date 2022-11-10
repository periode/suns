import { ENTRYPOINT_STATUS, IUser } from "./Entrypoint"
import { FiShare2, FiArrowRight } from "react-icons/fi"

interface EntrypointActionsProps {
	status : ENTRYPOINT_STATUS,
	users : IUser[]
	isOwner : boolean,
	lastStepIndex : number,
	currentStepIndex : number,
	claimEntryPoint : () => {},
	entrypointID: string
}

function EntrypointActions({
	status,
	users,
	isOwner,
	lastStepIndex,
	currentStepIndex,
	claimEntryPoint,
	entrypointID,
} : EntrypointActionsProps) {

	const copyToClipboard = (text : string) => {
		window.prompt("You can share this link: ", text);
	}
	
	const ShareButton = 
		<div    className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => { copyToClipboard( window.location.href ) } }>
            <FiShare2 className="text-xs"/>
			<p>Share</p>
        </div>

	const StartButton =
		<div    className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
                onClick={ claimEntryPoint }>
			<p>Start</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const NextButton =
		<div    className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => {  } }>
			<p>Next</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const FinishButton =
		<div	className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
				onClick={ () => {  } }>
			<p>Finish</p>
			<FiArrowRight className="text-xs"/>
		</div>

	const Step = 
	<p className="absolute 
					w-full h-full
					flex items-center justify-center
					text-center  font-mono
					opacity-50">
			{ currentStepIndex } / { lastStepIndex }
	</p>

	const rightButtonDisplay = () => {
		if (status === ENTRYPOINT_STATUS.EntrypointPending && isOwner)
		{
			if (currentStepIndex === lastStepIndex)
				return FinishButton
			else
				return NextButton
		}	
		else
		{
			if (status === ENTRYPOINT_STATUS.EntrypointOpen)
				return StartButton
			else
				return <></>
		}
	}


	return ( 
	<>
		{	
			status === ENTRYPOINT_STATUS.EntrypointPending && isOwner &&
				Step 
		}
		{ ShareButton } 
		{ rightButtonDisplay() }
	</> 
	);
}

export default EntrypointActions;