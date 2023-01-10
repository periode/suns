import animationData from "../../../animations/loader.json"
import Lottie from "react-lottie";


const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: animationData,
	className: "fill-red-500" ,
	renderSettings: {
		
	}
}

function Spinner() {
	return ( 
		<div className="">
			<Lottie 
				options={defaultOptions}
				isClickToPauseDisabled={true}
				segments={ [30, 90] }
				style={ {fill: "red"} } />
		</div>
	 );
}

export default Spinner;
