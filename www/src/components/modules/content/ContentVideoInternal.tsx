import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";

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
		<div className="w-full flex flex-col gap-2 items-center justify-start mb-5">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="text-sm">{assetIntro(
						contents,
						"video",
						ep_name,
						index,
						name
					) }</div>
			}
			<video className="w-auto max-h-80"
				key={key}
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				controls />
		</div>
	);
}

export default ContentVideoInternal;