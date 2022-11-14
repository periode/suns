import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { getSession } from "../../utils/auth"
import { IEntrypoint, IModule, IUpload } from "../../utils/types"

const MediaStreamRecorder = require('msr')

interface AudioRecorderProps {
    index: number,
    mod: IModule,
    ep: IEntrypoint,
    setUploads: Dispatch<SetStateAction<File[]>>,
    setUserCompleted: Dispatch<SetStateAction<boolean>>
}

const MAX_RECORD_TIME = 180 * 1000
var recorder: any

const AudioRecorder = ({index, mod, ep, setUploads, setUserCompleted}:AudioRecorderProps) => {
    const uploads = ep.modules[index - 1].uploads ? ep.modules[index - 1].uploads : null
    const [hasCompleted, setHasCompleted] = useState(mod.status)
    const session = getSession()
    const [recordingState, setRecordingState] = useState("idle")
    const [recordingMessage, setRecordingMessage] = useState("ready to record")
    const [stream, setStream] = useState({} as MediaStream)
    const [blobURL, setBlobURL] = useState("")

    useEffect(() => {
        setUserCompleted(false)
    }, [])

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
        if(recordingState === "done")
            return

        recorder.ondataavailable = function (blob: Blob) {
            audioBlob = blob
        };

        recorder.stop()
        setRecordingMessage("done!")
        setRecordingState("done")
        setBlobURL(URL.createObjectURL(audioBlob as Blob))

        setUploads([new File([audioBlob], "recording.wav")])
        setUserCompleted(true)
    }

    const resetRecording = () => {
        audioBlob = new Blob()
        setBlobURL("")
        setRecordingMessage("complete the module or start again")
        setRecordingState("idle")
        setUploads([])
    }

    const getUploadedMedia = () => {
        if (mod.uploads.length === 0) return (<></>)
        const session = getSession()
        if (mod.uploads[0].user_uuid === session.user.uuid)
            return (<audio src={`${process.env.REACT_APP_API_URL}/static/${mod.uploads[0].url}`} controls></audio>)

        if (mod.uploads.length === 1) return (<></>)

        if (mod.uploads[1].user_uuid === session.user.uuid)
            return (<audio src={`${process.env.REACT_APP_API_URL}/static/${mod.uploads[1].url}`} controls></audio>)
        return (<></>)
    }

    const getInputPrompt = () => {
        if (uploads === null || uploads.length === 0) return (<></>)

        if (uploads[0].user_uuid !== session.user.uuid)
            return (<audio src={`${process.env.REACT_APP_API_URL}/static/${uploads[0].url}`} controls></audio>)

        if (uploads.length === 1) return (<></>)

        if (uploads[1].user_uuid !== session.user.uuid)
            return (<audio src={`${process.env.REACT_APP_API_URL}/static/${uploads[1].url}`} controls></audio>)

        return (<>Could not find proper prompt</>)
    }

    return (
        <div key={`mod-${mod.name}`}>
            <div className="w-100 text-left text-sm l-0">{index + 1}</div>
            <p>
                {mod.content}
            </p>
            <div>
                {getUploadedMedia()}
                {getInputPrompt()}
                <div>
                    {mod.status !== "completed" && recordingState === "idle" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={startRecording}>record</button> : <></>}
                    {mod.status !== "completed" && recordingState === "recording" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={stopRecording}>stop</button> : <></>}
                    {mod.status !== "completed" && recordingState === "done" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={resetRecording}>restart</button> : <></>}
                </div>

                <p>{hasCompleted !== "completed" ? recordingMessage : ""}</p>
                {
                    blobURL !== "" ?
                        <audio src={blobURL} controls></audio>
                        :
                        <></>
                }
            </div>
        </div>
    )
}



export default AudioRecorder