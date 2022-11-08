import { ENTRYPOINT_STATUS } from "./Entrypoint"
import { FiShare2, FiArrowRight } from "react-icons/fi"
interface EntrypointActionsProps {
	status : ENTRYPOINT_STATUS,
	isOwner : boolean,
	lastStepIndex : number,
	currentStepIndex : number,
}

function EntrypointActions({
	status,
	isOwner,
	lastStepIndex,
	currentStepIndex,
} : EntrypointActionsProps) {
	
	const ShareButton = 
		<div    className="cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => {  } }>
            <FiShare2 className="text-xs"/>
			<p>Share</p>
        </div>

	const StartButton =
		<div    className="cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => {  } }>
			<p>Start</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const NextButton =
		<div    className="cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => {  } }>
			<p>Next</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const FinishButton =
		<div	className="cursor-pointer
							flex items-center
							gap-1"
				onClick={ () => {  } }>
			<p>Finish</p>
			<FiArrowRight className="text-xs"/>
		</div>

	const Step = 
	<p className="absolute 
					w-full h-full
					text-center text-mono
					opacity-50">
			{ currentStepIndex } / { lastStepIndex }
	</p>

	const rightButtonDisplay = () => {
		if (status === ENTRYPOINT_STATUS.EntrypointOpen && isOwner)
		{
			if (currentStepIndex === lastStepIndex)
				return FinishButton
			else
				return NextButton
		}	
		else
		{
			if (status === ENTRYPOINT_STATUS.EntrypointPending)
				return StartButton
			else
				return <></>
		}
	}
	
	console.log(
		"status: "				+ status,
		"isOwner: "				+ isOwner,
		"lastStepIndex: "		+ lastStepIndex,
		"currentStepIndex: "	+ currentStepIndex 
	)

	return ( 
	<>
		{	
			status === ENTRYPOINT_STATUS.EntrypointOpen && isOwner &&
				Step 
		}
		{ 
			// Always present
			ShareButton
		} 
		{
			rightButtonDisplay()
		}
	</> 
	);
}

export default EntrypointActions;