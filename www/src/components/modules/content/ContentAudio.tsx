import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";

interface ContentAudioProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
}

function ContentAudio({index, src, name, ep_name} : ContentAudioProps) {
	const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

	return ( 
		<div className="w-full flex flex-col gap-2 items-center justify-start mb-5">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="text-sm">{assetIntro(
						contents,
						"audio",
						ep_name,
						index,
						name
					) }</div>
			}
			<audio className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`} controls />
		</div>
	 );
}

export default ContentAudio;