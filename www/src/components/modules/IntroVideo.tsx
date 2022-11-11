import { useEffect } from "react"

const IntroVideo = (props: any) => {
    const data = props.data

    useEffect(() => {
        props.setUserCompleted(true)
    }, [])

    return (<>
        <div className="w-100 text-left  text-sm l-0">{props.index + 1}</div>
        <p>
            {data.content}
        </p>
        {data.media ?
            data.media.type === "video" ?
                <iframe title={data.media.type + "title"} src={data.media.url} width="640" height="360"></iframe>
                : <audio src={data.media.url}></audio>
            : <></>
        }
    </>)
}

export default IntroVideo