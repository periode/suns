import { useState } from "react";
import SpinnerSmall from "../../commons/Spinners/SpinnerSmall";

interface VideoPlayerProps {
	src: string,
}

function VideoPlayer({ src } : VideoPlayerProps) {

	const [hasLoaded, setLoaded] = useState(false)

	var styleAsset: React.CSSProperties
	if (hasLoaded)
		styleAsset = { display: "flex" }
	else
		styleAsset = { display: "hidden" }


	const handleOnLoad = () => {
		if (setLoaded)
			setLoaded(true) 
	}

	return (
		<div className="w-full max-h-80">
			{ !hasLoaded && <SpinnerSmall/> }
			<video className="w-full max-h-80"
				style={styleAsset}
				src={src}
				onCanPlay={ handleOnLoad }
				controls />
		</div>);
}

export default VideoPlayer;