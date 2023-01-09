import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";

function Community() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("CommunityGuidelines")

	return ( 
		<PulicPageLayout>
			<h1>Community Guidelines</h1>
			<p>{contents?.get("community_content_1")}</p>
		</PulicPageLayout>
	 );
}

export default Community;