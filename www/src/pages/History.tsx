import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";
import ContentVideoExternal from "../components/modules/content/ContentVideoExternal";

function History() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("History")

	return ( 
		<PulicPageLayout>
			<h1 className="text-6xl mb-6">History</h1>
			<div className="w-full mb-2">

				<ContentVideoExternal src={contents?.get("history_video_1")}/>
			</div>
			<p className="mb-8">{contents?.get("history_content_1")}</p>
		</PulicPageLayout>
	 );
}

export default History;