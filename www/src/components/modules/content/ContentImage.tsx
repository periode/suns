import React, { useContext, useRef, useState } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";
import SpinnerSmall from "../../commons/Spinners/SpinnerSmall";

interface ContentImageProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
}

function ContentImage({ index, src, name, ep_name }: ContentImageProps) {
	const ctx = useContext(AirTableContext)
	const contents = ctx.get("PublicView")
	
	const [hasLoaded, setLoaded] = useState(false)
	const fallbackAttempts = useRef(0)

	const handleMissingImage = (e: React.BaseSyntheticEvent) => {
		const t = e.currentTarget
		if (fallbackAttempts.current < 5) {
			setTimeout(() => {
				t.src = `${process.env.REACT_APP_SPACES_URL}/${src}`
			}, 3000)
			fallbackAttempts.current++
		}
	}

	var styleImg: React.CSSProperties
	if (hasLoaded)
		styleImg = { display: "block" }
	else
		styleImg = { display: "hidden" }
	return (
		<div className="w-full flex flex-col gap-2 items-start justify-start mb-5 break-words">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="font-mono text-xs opacity-70">{assetIntro(
					contents,
					UPLOAD_TYPE.Image,
					ep_name,
					index,
					name
				)}</div>
			}
			{
				!hasLoaded ? <SpinnerSmall />
				:	
				<img className="w-auto md:max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				alt={src}
				onError={handleMissingImage}
				style={styleImg}
				
				onLoad={ () => setLoaded(true)} />
			}
		</div>
	);
}

export default ContentImage;