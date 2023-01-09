import { useContext } from "react"
import { AirTableContext } from "./contexts/AirContext"
import PulicPageLayout from "./components/entrypoints/Layouts/PublicPageLayout"


const About = () => {

    const ctx = useContext(AirTableContext)
    const contents = ctx.get("About")

    return (
            <PulicPageLayout>
                <h1>About</h1>
                <h2>
                    { contents?.get("about_headline_1")}
                </h2>
                <p>
                    { contents?.get("about_content_1")}
                </p>
                <h2>
                    { contents?.get("about_headline_2")}
                </h2>
                <p>
                    { contents?.get("about_content_2")}
                </p>
                <h2>
                    { contents?.get("about_headline_3")}
                </h2>
                <p>
                    { contents?.get("about_content_3")}
                </p>
                <p>
                    okay okay
                </p>
            </PulicPageLayout>
    )
}

export default About