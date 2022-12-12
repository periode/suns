import { FiArrowRight } from 'react-icons/fi'

interface NextButtonProps {
	handleNextStage : () => void
}

function NextButton({ handleNextStage } : NextButtonProps) {
	return ( 
		<>
			<button className=" flex items-center justify-center gap-1
								w-full md:w-40 h-14 bg-none
							text-amber-500 font-mono font-bold border 
							border-1 border-amber-500
							hover:text-amber-600 hover:border-amber-600
							transition-all ease-in duration-300"
				onClick={handleNextStage}>Next<FiArrowRight /></button>
		</>
	 );
}

export default NextButton;