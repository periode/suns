import Spinner from "../Spinners/Spinner";

function LoadingApp() {
	return ( 
		<div className="absolute w-full h-full gap-2 
						flex flex-col items-center justify-center
						bg-amber-800">
			<div className="w-40">
				<Spinner/>
			</div>
		</div>
	 );
}

export default LoadingApp;