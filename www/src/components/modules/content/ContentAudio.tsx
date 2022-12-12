import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";

interface ContentAudioProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
}

function ContentAudio({index, src, name, ep_name} : ContentAudioProps) {
	const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

	const getLabel = () => {
		if(index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0)
			return(<div>{name} {contents?.get(`${ep_name}_video_${index}`)}:</div>)
		else
			return(<></>)
	}

	return ( 
		<div className="w-full flex flex-col mb-5">
			{getLabel()}
			<audio className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`} controls />
		</div>
	 );
}

export default ContentAudio;