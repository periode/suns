import ContentAudio from "./ContentAudio"
import ContentImage from "./ContentImage"
import ContentTextFromCSS from "./ContentTextFromCMS"
import ContentVideoExternal from "./ContentVideoExternal"

interface ContentProps {
    type: string
    airkey: string
    contents: Map<string, string>
}

const Content = ({ type, airkey, contents }: ContentProps) => {
    
    switch (type) {
        case "img":
            return (
                <ContentImage src={contents.get(airkey) || ""}/>)
        case "wav":
            return (
                <ContentAudio src={contents.get(airkey) || ""}/>
               )
        case "txt":
            return (
                <ContentTextFromCSS>{ contents.get(airkey) || "" }</ContentTextFromCSS>
            )
        case "vid":
            return (
                <ContentVideoExternal title={airkey + "title"} src={contents?.get(airkey) || ""} />
            )
        default:
            return (<>Couldn't find the type of content: {type}</>)
    }
}

export default Content