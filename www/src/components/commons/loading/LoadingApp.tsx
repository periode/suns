import Spinner from "../Spinners/Spinner";

function LoadingApp() {
	return ( 
		<div className="absolute w-full h-full 
						flex flex-col items-center justify-center">
			<h1>Loading map...</h1>
			<Spinner/>
		</div>
	 );
}

export default LoadingApp;