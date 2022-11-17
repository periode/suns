import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { getSession } from "../../utils/auth"
import { IEntrypoint, IFile, IModule, IUpload } from "../../utils/types"

const MediaStreamRecorder = require('msr')

interface AudioRecorderProps {
    index: number,
    mod: IModule,
    ep: IEntrypoint,
    handleNewUploads: Function,
    isRequestingUploads: boolean,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const MAX_RECORD_TIME = 180 * 1000
var recorder: any

const AudioRecorder = ({ index, mod, ep, handleNewUploads, isRequestingUploads, setUserDone, hasUserCompleted }: AudioRecorderProps) => {
    const inputs = ep.modules[index - 1].uploads ? ep.modules[index - 1].uploads : null
    const session = getSession()
    const [uploads, setUploads] = useState(Array<IFile>)
    const [recordingState, setRecordingState] = useState("idle")
    const [recordingMessage, setRecordingMessage] = useState("ready to record")
    const [stream, setStream] = useState({} as MediaStream)
    const [blobURL, setBlobURL] = useState("")

    useEffect(() => {
        setUserDone(false)
    }, [])

    useEffect(() => {
		if(isRequestingUploads)
			handleNewUploads(uploads)

	}, [isRequestingUploads])

    var audioBlob = {} as Blob

    const startRecording = () => {
        try {
            // window.AudioContext = window.AudioContext || window.webkitAudioContext // TODO we might need to create an interface to deal with the audio context
            window.URL = window.URL || window.webkitURL
        } catch (e) {
            alert("no web audio here!")
            return
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(startUserMedia)
            .catch((e) => {
                if (e.name === "NotAllowedError") {
                    setRecordingMessage("An error happened. Please make sure to enable microphone access on your device!")
                } else {
                    console.error(e);

                    setRecordingMessage("An unknown error happened. Make sure you have a microphone working on your device.")
                }
            });

        function startUserMedia(_st: MediaStream) {
            setRecordingMessage("starting...")
            setRecordingState("recording")
            setStream(_st)

            recorder = new MediaStreamRecorder(_st);
            recorder.mimeType = 'audio/wav'
            recorder.ondataavailable = function (blob: Blob) {
                audioBlob = blob
            };
            recorder.start(MAX_RECORD_TIME)

            setTimeout(stopRecording, MAX_RECORD_TIME + 1)
        }
    }

    const stopRecording = () => {
        if (recordingState === "done")
            return

        recorder.ondataavailable = function (blob: Blob) {
            audioBlob = blob
        };

        recorder.stop()
        setRecordingMessage("done!")
        setRecordingState("done")
        setBlobURL(URL.createObjectURL(audioBlob as Blob))
        setUploads([{ file: new File([audioBlob], "recording.wav"), text: "" }])

        setUserDone(true)
    }

    const resetRecording = () => {
        audioBlob = new Blob()
        setBlobURL("")
        setRecordingMessage("complete the module or start again")
        setRecordingState("idle")
        setUploads([])
        setUserDone(false)
    }

    const getInputPrompt = () => {
        if (inputs === null || inputs.length === 0) return (<></>)

        if (inputs[0].user_uuid !== session.user.uuid)
            switch (inputs[0].type) {
                case "text/plain":
                    return (<>{inputs[0].text}</>)
                case "audio/*":
                    return (<audio src={`${process.env.REACT_APP_API_URL}/static/${inputs[0].url}`} controls></audio>)
                case "video/*":
                    return (<video src={`${process.env.REACT_APP_API_URL}/static/${inputs[0].url}`} controls></video>)
                case "image/*":
                    return (<img src={`${process.env.REACT_APP_API_URL}/static/${inputs[0].url}`} />)

                default:
                    break;
            }

        if (inputs.length === 1) return (<></>)

        if (inputs[1].user_uuid !== session.user.uuid)
            switch (inputs[1].type) {
                case "text/plain":
                    return (<>{inputs[1].text}</>)
                case "audio/*":
                    return (<audio src={`${process.env.REACT_APP_API_URL}/static/${inputs[1].url}`} controls></audio>)
                case "video/*":
                    return (<video src={`${process.env.REACT_APP_API_URL}/static/${inputs[1].url}`} controls></video>)
                case "image/*":
                    return (<img src={`${process.env.REACT_APP_API_URL}/static/${inputs[1].url}`} />)

                default:
                    break;
            }

        return (<>Could not find proper prompt</>)
    }

    return (
        <div key={`mod-${mod.name}`}>
            <p>
                {mod.content}
            </p>
            <div className="flex flex-row mt-10">
                <div className="flex-1">
                    {
                        uploads && uploads.length > 0 ?
                            <>
                                {getInputPrompt()}
                            </> : <></>
                    }
                </div>
                <div className="flex-1">
                    {!hasUserCompleted && recordingState === "idle" ? <button className="bg-amber-900 text-white p-1 m-1" onClick={startRecording}>record</button> : <></>}
                    {!hasUserCompleted && recordingState === "recording" ? <button className="bg-amber-900 text-white p-1 m-1" onClick={stopRecording}>stop</button> : <></>}
                    {!hasUserCompleted && recordingState === "done" ? <button className="bg-amber-900 text-white p-1 m-1" onClick={resetRecording}>restart</button> : <></>}
                    <p>{recordingMessage}</p>
                </div>
                <div className="flex-1">
                    {
                        blobURL !== "" && !hasUserCompleted ?
                            <audio src={blobURL} controls></audio>
                            :
                            <></>
                    }
                </div>

            </div>
        </div>
    )
}



export default AudioRecorder