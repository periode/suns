import ContentVideoExternal from "../modules/content/ContentVideoExternal"


interface ContentProps {
    type: string
    airkey: string
    contents?: Map<string, string>,
    value?: string,
}

const Content = ({ type, airkey, contents, value }: ContentProps) => {

    if (value != "") {
        return (<>
            <div>{value}</div>
        </>)
    }else if(contents != undefined){
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
                    <ContentVideoExternal title={airkey + "title"} src={contents?.get(airkey) || ""} />
                </>)

            default:
                return (<>Couldn't find the type of content: {type}</>)
        }
    }

    return (<>
        There was a problem getting information from the Airtable
    </>)
}

export default Content