import { useContext } from "react"
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";


const About = () => {

    const ctx = useContext(AirTableContext)
    const contents = ctx.get("About")

    return (
            <PulicPageLayout>
                <h1 className="text-4xl mb-2">About</h1>
                <h2 className="text-2xl mb-1">
                    { contents?.get("about_headline_1")}
                </h2>
                <p className="mb-2">
                    { contents?.get("about_content_1")}
                </p>
                <h2 className="text-2xl">
                    { contents?.get("about_headline_2")}
                </h2>
                <p className="mb-2">
                    { contents?.get("about_content_2")}
                </p>
                <h2 className="text-2xl">
                    { contents?.get("about_headline_3")}
                </h2>
                <p className="mb-2">
                    { contents?.get("about_content_3")}
                </p>
            </PulicPageLayout>
    )
}

export default About