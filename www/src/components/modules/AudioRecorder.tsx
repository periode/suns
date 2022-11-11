import { useState } from "react"
import { getSession } from "../../utils/auth"

const MediaStreamRecorder = require('msr')

const MAX_RECORD_TIME = 180
var recorder: any

const AudioRecorder = (props: any) => {
    const data = props.data
    const [hasCompleted, setHasCompleted] = useState(props.data.status)
    const session = getSession()
    const [recordingState, setRecordingState] = useState("idle")
    const [recordingMessage, setRecordingMessage] = useState("ready to record")
    const [stream, setStream] = useState({} as MediaStream)
    const [blobURL, setBlobURL] = useState("")

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
            recorder.start(MAX_RECORD_TIME * 1000)
        }
    }

    const stopRecording = () => {
        recorder.ondataavailable = function (blob: Blob) {
            audioBlob = blob
        };

        recorder.stop()
        setRecordingMessage("done!")
        setRecordingState("done")
        setBlobURL(URL.createObjectURL(audioBlob as Blob))

        props.setUploads([new File([audioBlob], "recording.wav")])
    }

    const resetRecording = () => {
        audioBlob = new Blob()
        setBlobURL("")
        setRecordingMessage("complete the module or start again")
        setRecordingState("idle")
        props.setUploads([])
    }

    return (
        <div key={`mod-${data.name}`}>
            <h3>{data.name}</h3>
            <p>
                {data.content}
            </p>
            <div>
                <h4>Audio recorder</h4>
                {
                    data.uploads.length === 1 && data.uploads[0].user_uuid !== session.user.uuid ?
                        <div>
                            <h3>Listen to the audio of your partner</h3>
                            <audio src={`${process.env.REACT_APP_API_URL}/static/${data.uploads[0].url}`} controls></audio>
                        </div>
                        : <></>
                }
                <div>
                    {hasCompleted !== "completed" && recordingState === "idle" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={startRecording}>record</button> : <></>}
                    {hasCompleted !== "completed" && recordingState === "recording" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={stopRecording}>stop</button> : <></>}
                    {hasCompleted !== "completed" && recordingState === "done" ? <button className="bg-amber-800 text-white p-1 m-1" onClick={resetRecording}>restart</button> : <></>}
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