import SpinnerSmall from "../commons/Spinners/SpinnerSmall";

interface WaitingModuleProps{
	ParterName? : string
}

function WaitingModule({ ParterName = "your partner" }: WaitingModuleProps) {
	return ( 
		<div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-80 text-center">
			<SpinnerSmall/>
			<h2 className="text-6xl">Thank you,</h2>
			<p className="text-sm">You completed the module and we're now waiting for <span>{ ParterName }</span> to finish.</p>
		</div>
	 );
}

export default WaitingModule;