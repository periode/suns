import ContentVideo from "../modules/content/ContentVideo"

interface ContentProps {
    type: string
    airkey: string
    contents: Map<string, string>
}

const Content = ({ type, airkey, contents }: ContentProps) => {
    
    switch (type) {
        case "img":
            return (<div className="flex h-24 m-auto w-auto">
                <img className="object-contain" src={contents.get(airkey)} />
            </div>)
        case "mp3":
            return (<>
                <audio src=""></audio>
                <div>{contents.get(airkey)}</div>
            </>)
        case "txt":
            return (<>
                <div>{contents.get(airkey)}</div>
            </>)
        case "vid":
            return (<>
                <ContentVideo title={airkey + "title"} src={contents?.get(airkey) || ""}/>
            </>)

        default:
            return (<>Couldn't find the type of content: {type}</>)
    }
}

export default Content