import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";

function Privacy() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("Privacy")

	return ( 
		<PulicPageLayout>
			<h1 className="text-6xl mb-6">Privacy Policy</h1>
			<h2 className="text-2xl mb-2">
				{ contents?.get("privacy_headline_1")}
			</h2>
			<p className="mb-8">
				{ contents?.get("privacy_content_1")}
			</p>
			<h2 className="text-2xl mb-2">
				{ contents?.get("privacy_headline_2")}
			</h2>
			<p className="mb-8">
				{ contents?.get("privacy_content_2")}
			</p>
			<h2 className="text-2xl mb-2">
				{ contents?.get("privacy_headline_3")}
			</h2>
			<p className="mb-8">
				{ contents?.get("privacy_content_3")}
			</p>
			<h2 className="text-2xl mb-2">
				{ contents?.get("privacy_headline_4")}
			</h2>
			<p className="mb-8">
				{ contents?.get("privacy_content_4")}
			</p>
		</PulicPageLayout>
	 );
}

export default Privacy;