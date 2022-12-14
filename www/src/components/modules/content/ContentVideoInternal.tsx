import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";
import VideoPlayer from "./VideoPlayer";

interface ContentVideoProps {
	index?: number,
	key?: string,
	src?: string,
	name?: string,
	ep_name?: string,
}

function ContentVideoInternal({ index, key, src, name, ep_name }: ContentVideoProps) {
	const ctx = useContext(AirTableContext)
	const contents = ctx.get("PublicView")
	
	return (
		<div className="w-full flex flex-col gap-2 items-start justify-start mb-5 break-words">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="font-mono text-xs opacity-70">{assetIntro(
						contents,
						UPLOAD_TYPE.Video,
						ep_name,
						index,
						name
					) }</div>
			}
			<VideoPlayer src={`${process.env.REACT_APP_SPACES_URL}/${src}`}/>
		</div>
	);
}

export default ContentVideoInternal;