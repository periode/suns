import { FiArrowRight, FiCheck } from 'react-icons/fi'

interface SubmitButtonProps {
	onClick : () => void
}

function SubmitButton({ onClick } : SubmitButtonProps) {
	return ( 
		<>
			<button className=" flex items-center justify-center gap-1
								h-8 bg-none p-4 pl-6 pr-6
							text-amber-50 font-mono text-sm font-semibold
							
							bg-amber-500 hover:bg-amber-600
							transition-all ease-in duration-300"
				onClick={onClick}>Submit<FiCheck strokeWidth={4} /></button>
		</>
	 );
}

export default SubmitButton;