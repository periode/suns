import { ENTRYPOINT_STATUS, IEntrypoint, IUser } from "./Entrypoint"
import { FiShare2, FiArrowRight } from "react-icons/fi"

interface EntrypointActionsProps {
	entryPointData: IEntrypoint,
	isOwner : boolean,
	session : Object,
	claimEntryPointFunction : () => {},
	completeModuleFunction : (data : any, session : Object) => Promise<void>,
}

function EntrypointActions({
	entryPointData,
	claimEntryPointFunction,
	completeModuleFunction,
	isOwner,
	session
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
                onClick={ claimEntryPointFunction }>
			<p>Start</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const NextButton =
		<div    className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => completeModuleFunction(entryPointData, session) }>
			<p>Next</p>
            <FiArrowRight className="text-xs"/>
        </div>

	const FinishButton =
		<div	className=" font-mono
							cursor-pointer
							flex items-center
							gap-1"
				onClick={ () => completeModuleFunction(entryPointData, session) }>
			<p>Finish</p>
			<FiArrowRight className="text-xs"/>
		</div>

	const Step = 
	<p className=" 	w-full h-full
					flex items-center justify-center
					text-center  font-mono
					opacity-50">
			{ entryPointData.current_module } / { entryPointData.modules.length }
	</p>

	const rightButtonDisplay = () => {
		if (entryPointData.status === ENTRYPOINT_STATUS.EntrypointPending && isOwner)
		{
			if (entryPointData.current_module === entryPointData.modules.length)
				return FinishButton
			else
				return NextButton
		}	
		else
		{
			if (entryPointData.status === ENTRYPOINT_STATUS.EntrypointOpen)
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