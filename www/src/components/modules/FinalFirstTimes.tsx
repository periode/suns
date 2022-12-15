import AudioPlayer from "./content/AudioPlayer"


const FinalFirstTimes = (props: any) => {
    const data = props.data
    const getUserContent = (user: any) => {
        if (data === undefined || data.modules.length === 0 || data.modules[1].uploads.length === 0 || data.modules[2].uploads.length === 0) return (<></>)

        //-- take the one uploaded by the given user
        const promptURL = data.modules[1].uploads[0].user_uuid === user.uuid ?
            data.modules[1].uploads[0].url
            :
            data.modules[1].uploads[1].url

        //-- take the one not uploaded by the given user
        const answerURL = data.modules[2].uploads[0].user_uuid !== user.uuid ? data.modules[2].uploads[0].url : data.modules[2].uploads[1].url

        return (
            <>
                question of partner 1:
                <AudioPlayer src={`${process.env.REACT_APP_API_URL}/static/${promptURL}`} final={true} />
                answer of partner 2:
                <AudioPlayer src={`${process.env.REACT_APP_API_URL}/static/${answerURL}`} final={true}/>
            </>
        )
    }

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <div>
                    {data.users[0].name}
                </div>
                <div>Outcome 1</div>
                <div>
                    {getUserContent(data.users[0])}
                </div>
            </div>

            <div className="flex flex-col">
                <div>
                    {data.users[1].name}
                </div>
                <div>Outcome 2</div>
                <div>
                    {getUserContent(data.users[1])}
                </div>
            </div>
        </div>
    )
}

export default FinalFirstTimes