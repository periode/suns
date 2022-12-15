import React, { useContext, useRef } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";

interface ContentImageProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
}

function ContentImage({ index, src, name, ep_name }: ContentImageProps) {
	const ctx = useContext(AirTableContext)
	const contents = ctx.get("PublicView")
	
	const hadAttemptedFallback = useRef(false)

	const handleMissingImage = (e: React.BaseSyntheticEvent) => {
		const t = e.currentTarget
		if (hadAttemptedFallback.current !== true)
		{
			t.src = `${process.env.REACT_APP_API_URL}/static/${src}`
			hadAttemptedFallback.current = true
		}
	}

	// var assetIntro = () => {

	// 	const narrationString : string | undefined = contents?.get(`${ep_name}_image_${index}`)
		
	// 	if (narrationString && name)
	// 		return narrationString.replace("{user}", name)
	// 	else
	// 		return name + ":"
	// }


	return (
		<div className="w-full flex flex-col gap-2 items-center justify-start mb-5">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="text-sm">{assetIntro(
						contents,
						UPLOAD_TYPE.Image,
						ep_name,
						index,
						name
					) }</div>
			}
			<img className="w-auto md:max-h-80 self-center"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				alt={src}
				onError={handleMissingImage} />
		</div>
	);
}

export default ContentImage;