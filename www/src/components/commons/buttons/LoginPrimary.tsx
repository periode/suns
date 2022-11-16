
interface LoginPrimaryProps {
	text : string,
	onClick? : (e: React.BaseSyntheticEvent) => void
}

function LoginPrimary({ 
		text,		
		onClick 
	} : LoginPrimaryProps) {

	return ( 
		<button className=" flex items-center justify-center 
							w-full h-14 bg-amber-500 
							text-white font-mono font-bold
							hover:bg-amber-600 hover:text-amber-50
							transition-all ease-in duration-300"
				onClick={ onClick }>
							{ text }
		</button>
	 );
}

export default LoginPrimary;