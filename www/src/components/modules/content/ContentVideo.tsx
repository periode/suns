import { ReactEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

interface ContentVideoProps {
	title? : string,
	src?: string,
}

function ContentVideo({
	title,
	src
	} : ContentVideoProps) {

	return ( 
		
		<div className="flex items-center justify-start">
			<video className="w-auto max-h-80"
				src={`${process.env.REACT_APP_API_URL}/static/${src}`}
				controls/>
		</div>
	 );
}

export default ContentVideo;