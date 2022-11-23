import ContentAudio from "../modules/content/ContentAudio"
import ContentPhoto from "../modules/content/ContentPhoto"
import ContentVideoExternal from "../modules/content/ContentVideoExternal"

interface ContentProps {
    type: string
    airkey: string
    contents: Map<string, string>
}

const IntroContent = ({ type, airkey, contents }: ContentProps) => {
    
    switch (type) {
        case "img":
            return (
                <ContentPhoto src={contents.get(airkey) || ""}/>)
        case "mp3":
            return (
                <ContentAudio src={contents.get(airkey) || ""}/>
               )
        case "txt":
            return (
                <p>{ contents.get(airkey) || "" }</p>
            )
        case "vid":
            return (
                <ContentVideoExternal title={airkey + "title"} src={contents?.get(airkey) || ""} />
            )
        default:
            return (<>Couldn't find the type of content: {type}</>)
    }
}

export default IntroContent