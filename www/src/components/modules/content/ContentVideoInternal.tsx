import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";

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

	const getLabel = () => {
		if(index && name && name.length > 0 && ep_name && ep_name.length > 0)
			return(<div>{name} {contents?.get(`${ep_name}_video_${index}`)}:</div>)
		else
			return(<></>)
	}

	return (
		<div className="flex flex-col items-center justify-start mb-5">
			{getLabel()}
			<video className="w-auto max-h-80"
				key={key}
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				controls />
		</div>
	);
}

export default ContentVideoInternal;