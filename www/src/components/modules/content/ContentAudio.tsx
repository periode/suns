import { useContext, useState } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";
import AudioPlayer from "./AudioPlayer";
import SpinnerSmall from "../../commons/Spinners/SpinnerSmall";

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

	const [hasLoaded, setLoaded] = useState(false)
	var styleAsset: React.CSSProperties
	if (hasLoaded)
		styleAsset = { display: "block" }
	else
		styleAsset = { display: "hidden" }

	return ( 
		<div className="w-full flex flex-col gap-2 items-start justify-start mb-5 break-words">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="font-mono text-xs opacity-70">{assetIntro(
						contents,
						UPLOAD_TYPE.Audio,
						ep_name,
						index,
						name
					) }</div>
			}
			{!hasLoaded && <SpinnerSmall />}
			<div className="w-full" style={styleAsset}>
				<AudioPlayer
					src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
					final={final}
					setLoaded={setLoaded}
					hasLoaded={hasLoaded}
				/>
			</div>
		</div>
	 );
}

export default ContentAudio;