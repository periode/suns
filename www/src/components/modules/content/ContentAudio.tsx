import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";
import AudioPlayer from "./AudioPlayer";

interface ContentAudioProps {
	index?: number,
	src: string,
	name?: string,
	ep_name?: string,
	final? : boolean
}

function ContentAudio({index, src, name, ep_name, final=false} : ContentAudioProps) {
	const ctx = useContext(AirTableContext)
    const contents = ctx.get("PublicView")

	return ( 
		<div className="w-full flex flex-col gap-2 items-center justify-start">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="text-sm">{assetIntro(
						contents,
						UPLOAD_TYPE.Audio,
						ep_name,
						index,
						name
					) }</div>
			}
			<AudioPlayer src={`${process.env.REACT_APP_SPACES_URL}/${src}`} final={final}/>
		</div>
	 );
}

export default ContentAudio;