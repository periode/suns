import Spinner from "../Spinners/Spinner";

function LoadingApp() {
	return ( 
		<div className="absolute w-full h-full 
						flex flex-col items-center justify-center
						bg-amber-100">
			<h1 className="font-mono text-center opacity-50">Loading map...</h1>
			<Spinner/>
		</div>
	 );
}

export default LoadingApp;