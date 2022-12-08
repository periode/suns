import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";

interface ContentTextProps {
	index?: number,
	text: string,
	name?: string,
	ep_name?: string,
	final : boolean
}

function ContentText({ index, text, name, ep_name, final }: ContentTextProps) {
	const ctx = useContext(AirTableContext)
	const contents = ctx.get("PublicView")
	console.log(name, ep_name, index);
	
	const getLabel = () => {
		if (index != undefined && name && name.length > 0 && ep_name && ep_name.length > 0)
			return (<div>{name} {contents?.get(`${ep_name}_text_${index}`)}:</div>)
		else
			return (<></>)
	}



	return (
		<div className="flex flex-col mb-5">
			<div>
				{getLabel()}
			</div>
			{
				final ?
				<div className="w-full p-4 text-serif bg-green-100 text-green-700">
					<p>{text}</p>
				</div>
				:
				<div className="w-full p-4 text-serif bg-amber-100 text-amber-600">
					<p>{text}</p>
				</div>
			}
		</div>

	);
}

export default ContentText;