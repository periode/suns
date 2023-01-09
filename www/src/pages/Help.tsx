import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";

function Help() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("Help")

	return (
		<PulicPageLayout>
			<h1>Team</h1>
			<h2>{contents?.get("help_headline_1")}</h2>
			<p>{contents?.get("help_content_1")}</p>
			<h2>{contents?.get("help_headline_2")}</h2>
			<p>{contents?.get("help_content_2")}</p>
			<h2>{contents?.get("help_headline_3")}</h2>
			<p>{contents?.get("help_content_3")}</p>
			<h2>{contents?.get("help_headline_4")}</h2>
			<p>{contents?.get("help_content_4")}</p>
			<h2>{contents?.get("help_headline_5")}</h2>
			<p>{contents?.get("help_content_5")}</p>
			<h2>{contents?.get("help_headline_6")}</h2>
			<p>{contents?.get("help_content_6")}</p>
			<h2>{contents?.get("help_headline_7")}</h2>
			<p>{contents?.get("help_content_7")}</p>
			<h2>{contents?.get("help_headline_8")}</h2>
			<p>{contents?.get("help_content_8")}</p>
			<h2>{contents?.get("help_headline_9")}</h2>
			<p>{contents?.get("help_content_9")}</p>
			<h2>{contents?.get("help_headline_10")}</h2>
			<p>{contents?.get("help_content_10")}</p>
			<h2>{contents?.get("help_headline_11")}</h2>
			<p>{contents?.get("help_content_11")}</p>
			<h2>{contents?.get("help_headline_12")}</h2>
			<p>{contents?.get("help_content_12")}</p>
			<h2>{contents?.get("help_headline_13")}</h2>
			<p>{contents?.get("help_content_13")}</p>
			<h2>{contents?.get("help_headline_14")}</h2>
			<p>{contents?.get("help_content_14")}</p>
			<h2>{contents?.get("help_headline_15")}</h2>
			<p>{contents?.get("help_content_15")}</p>
			<h2>{contents?.get("help_headline_16")}</h2>
			<p>{contents?.get("help_content_16")}</p>
			<h2>{contents?.get("help_headline_17")}</h2>
			<p>{contents?.get("help_content_17")}</p>
			<h2>{contents?.get("help_headline_18")}</h2>
			<p>{contents?.get("help_content_18")}</p>	
		</PulicPageLayout>);
}

export default Help;