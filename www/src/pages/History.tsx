import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";
import ContentVideoExternal from "../components/modules/content/ContentVideoExternal";

function History() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("History")

	return ( 
		<PulicPageLayout>
			<h1 className="text-4xl">History</h1>
			<p>{contents?.get("history_content_1")}</p>
			<ContentVideoExternal src={contents?.get("history_video_1")}/>
		</PulicPageLayout>
	 );
}

export default History;