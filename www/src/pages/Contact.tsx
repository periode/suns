import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";

function Contact() {

	const ctx = useContext(AirTableContext)
	const contact = ctx.get("Contact")
	
	return ( 
		<PulicPageLayout>
			<h1 className="text-6xl mb-6">Contact</h1>
			<p className="mb-8">{contact?.get("contact_content_1")}</p>
		</PulicPageLayout>
	 );
}

export default Contact;