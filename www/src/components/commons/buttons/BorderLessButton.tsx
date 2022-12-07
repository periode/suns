import { IconBase, IconContext, IconType } from 'react-icons';

interface BorderLessButtonProps {
	action: () => void,
	icon?: IconType,
	text: string
}

function BorderLessButton({ action, icon, text }: BorderLessButtonProps) {
	const Icon = icon
	return ( 
		<>
			<button className=" 
								flex items-center justify-center gap-2
								w-full md:w-40 h-14 bg-none
								bg-amber-200
							text-amber-500 font-mono font-bold border-amber-500
							hover:text-amber-600 hover:border-amber-600
							transition-all ease-in duration-300"
				onClick={action}>
					<p>{text}</p>
					{
						Icon &&
						<Icon/>
					}
			</button>
		</>
	 );
}

export default BorderLessButton;