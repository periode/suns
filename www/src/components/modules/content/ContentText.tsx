import { useContext } from "react";
import { AirTableContext } from "../../../contexts/AirContext";
import { assetIntro } from "../../../utils/entrypoint";
import { UPLOAD_TYPE } from "../../../utils/types";

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
	
	return (
		<div className="w-full flex flex-col gap-2 items-start justify-start mb-5 break-words">
			{
				index !== undefined && name && name.length > 0 && ep_name && ep_name.length > 0 &&
				<div className="font-mono text-xs opacity-70">{assetIntro(
						contents,
						UPLOAD_TYPE.Text,
						ep_name,
						index,
						name
					) }</div>
			}
			{
				final ?
				<div className="w-full p-4 text-serif bg-green-100 text-green-700 text-sm ">
					<p>{text}</p>
				</div>
				:
				<div className="w-full p-4 text-serif bg-amber-100 text-amber-600 text-sm">
					<p>{text}</p>
				</div>
			}
		</div>

	);
}

export default ContentText;