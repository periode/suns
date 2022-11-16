
interface LoginSecondaryProps {
	text : string,
	onClick? : (e: React.BaseSyntheticEvent) => void
}

function LoginSecondary({ 
		text,		
		onClick 
	} : LoginSecondaryProps) {
	return ( 
		<button className="flex items-center justify-center 
							w-full h-14 bg-none
							text-amber-500 font-mono font-bold border 
							border-1 border-amber-500
							hover:text-amber-600 hover:border-amber-600
							transition-all ease-in duration-300"
				onClick={ onClick }>
							{ text }
		</button>
	 );
}

export default LoginSecondary;