import { Dispatch, SetStateAction, useEffect } from "react"
import { IModule } from "../../utils/types"

interface IntroVideoProps {
    data : IModule,
    index: number,
    setUserCompleted: Dispatch<SetStateAction<boolean>>
}

const IntroVideo = ({ data, index, setUserCompleted } : IntroVideoProps) => {

    useEffect(() => {
        setUserCompleted(true)
    }, [])

    return (<>
        <div className="w-100 text-left  text-sm l-0">{index + 1}</div>
        <p>
            {data.content}
        </p>
        { 
            data.media ?
            data.media.type === "video" ?
                <iframe title={data.media.type + "title"} src={data.media.url} width="640" height="360"></iframe>
                : <audio src={data.media.url}></audio>
            : <></>
        }
    </>)
}

export default IntroVideo