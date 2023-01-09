import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";

function Privacy() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("Privacy")

	return ( 
		<PulicPageLayout>
			<h1>Privacy Policy</h1>
			<h2>{ contents?.get("about_headline_1")}</h2>
			<p>{ contents?.get("about_content_1")}</p>
			<h2>{ contents?.get("about_headline_2")}</h2>
			<p>{ contents?.get("about_content_2")}</p>
			<h2>{ contents?.get("about_headline_3")}</h2>
			<p>{ contents?.get("about_content_3")}</p>
			<h2>{ contents?.get("about_headline_4")}</h2>
			<p>{ contents?.get("about_content_4")}</p>
		</PulicPageLayout>
	 );
}

export default Privacy;