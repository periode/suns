import { ENTRYPOINT_STATUS } from "./Entrypoint"
import { FiShare2, FiArrowRight } from "react-icons/fi"
interface EntrypointActionsProps {
	status : ENTRYPOINT_STATUS,

}

function EntrypointActions({} : EntrypointActionsProps) {
	
	const ShareButton = 
		<div    className="cursor-pointer
							flex items-center
							gap-1"
                onClick={ () => {  } }>
            <FiShare2 className="text-xs"/>
			<p>Share</p>
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
	<div className="absolute text-center
					text-mono">

	</div>
	
	return ( 
	<>
		{ ShareButton }
	</> 
	);
}

export default EntrypointActions;