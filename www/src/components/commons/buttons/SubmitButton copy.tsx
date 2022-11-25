import { FiArrowRight, FiCheck } from 'react-icons/fi'

interface SubmitButtonProps {
	onClick : () => void
}

function SubmitButton({ onClick } : SubmitButtonProps) {
	return ( 
		<>
			<button className=" flex items-center justify-center gap-1
								h-8 bg-none pl-4 pr-4
							text-amber-500 font-mono text-sm font-bold 
							border border-1 border-amber-500
							hover:text-amber-600 hover:border-amber-600
							transition-all ease-in duration-300"
				onClick={onClick}>Submit<FiCheck strokeWidth={4} /></button>
		</>
	 );
}

export default SubmitButton;