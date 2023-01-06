import React, { useState } from "react";
import SpinnerSmall from "../../commons/Spinners/SpinnerSmall";

interface ContentVideoExternalProps {
	title? : string,
	src?: string,
}

function ContentVideoExternal({
	title,
	src
	} : ContentVideoExternalProps) {

	const [hasLoaded, setLoaded] = useState(false)
	
	var styleAsset: React.CSSProperties
	if (hasLoaded)
		styleAsset = { display: "block" }
	else
		styleAsset = { display: "hidden" }
	
	
	return ( 
		<div className="w-full" style={styleAsset}>
			{ !hasLoaded && <SpinnerSmall/> }
			<iframe
				className="aspect-video"
				title={title}
				src={src}
				style={{ width: "100%", height: "100%" }}
				allow="autoplay; fullscreen; picture-in-picture"
				onLoad={ () => setLoaded(true) }
			></iframe>
		</div>
	 );
}

export default ContentVideoExternal;