import { Dispatch, SetStateAction, useEffect } from "react"
import { IModule } from "../../utils/types"

interface IntroVideoProps {
    data: IModule,
    index: number,
    setUserDone: Dispatch<SetStateAction<boolean>>
}

const IntroVideo = ({ data, index, setUserDone }: IntroVideoProps) => {

    useEffect(() => {
        setUserDone(true)
    }, [])

    return (<>
        <div className="w-100 text-left  text-sm l-0">{index + 1}</div>
        <div >
            {
                data.media ?
                    data.media.type === "video" ?
                        <iframe className="m-auto block" title={data.media.type + "title"} src={data.media.url} width="640" height="360"></iframe>
                        : <audio src={data.media.url}></audio>
                    : <></>
            }
        </div>
        <p className="mt-5">
            {data.content}
        </p>
    </>)
}

export default IntroVideo