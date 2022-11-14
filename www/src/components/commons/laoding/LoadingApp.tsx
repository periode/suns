import Spinner from "../Spinner";

function LoadingApp() {
	return ( 
		<div className="absolute w-full h-full 
						flex flex-col items-center justify-center">
			<h1>Loadind map</h1>
			<Spinner/>
		</div>
	 );
}

export default LoadingApp;