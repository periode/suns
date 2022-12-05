import React, { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";

interface ContentImageProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
}

function ContentImage({ index, src, name, ep_name }: ContentImageProps) {
	const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

	const getLabel = () => {
		if(index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0)
			return(<div>{name} {contents?.get(`${ep_name}_image_${index}`)}:</div>)
		else
			return(<></>)
	}

	const handleMissingImage = (e: React.BaseSyntheticEvent) => {
		const t = e.currentTarget
		t.src = `${process.env.REACT_APP_API_URL}/static/${src}`
	}

	return (
		<div className="flex flex-col items-center justify-start mb-5">
			{getLabel()}
			<img className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				alt={src}
				onError={handleMissingImage} />
		</div>
	);
}

export default ContentImage;