import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { FiMic, FiPlay, FiRotateCcw, FiSquare, FiStopCircle } from "react-icons/fi"
import { getSession } from "../../../utils/auth"
import { IEntrypoint, IFile, IModule, IUpload } from "../../../utils/types"
import AudioRecorderCountdown from "./utils/AudioRecorderCountdown"

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

const MAX_RECORD_TIME = 3 * 60 * 1000
var recorder: any

const AudioRecorder = ({ index, mod, ep, handleNewUploads, isRequestingUploads, setUserDone, hasUserCompleted }: AudioRecorderProps) => {
    const inputs = ep.modules[index - 1].uploads ? ep.modules[index - 1].uploads : null
    const session = getSession()
    const [uploads, setUploads] = useState(Array<IFile>)
    const [recordingState, setRecordingState] = useState("idle")
    const [recordingMessage, setRecordingMessage] = useState("Ready to record")
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

        console.log("stopRecording")
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
        setRecordingMessage("Ready to record")
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

    const handleRecordButtonClick = () => {
        console.log("Calling handleRecordButtonClick with recordingState: " + recordingState)
        switch (recordingState) {
            case "idle":
                startRecording()
                break;
            case "recording":
                stopRecording()
                break;
            case "done":
                resetRecording()
                break;
            default:
                console.error("handleRecordButtonClick : an error occured, recordinState:", recordingState)
                break;
        }
    }

    return (
        <div className="w-full font-mono" key={`mod-${mod.name}`}>
            <p>
                {mod.content} 
            </p>
            <div className="w-full flex flex-col items-start bg-amber-200">
                <div className="w-full">
                    {
                        uploads && uploads.length > 0 ?
                            <>
                                { getInputPrompt() }
                            </> : <></>
                    }
                </div>
                <div className="flex items-center justify-between gap-2
                                w-full p-2 bg-amber-100">
                        <div className="flex-1 h-full
                                        flex items-center justify-center">
                            {
                                recordingState === "recording" ?
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
                                    <AudioRecorderCountdown time={MAX_RECORD_TIME}/>
                                </div>
                                :
                                recordingState === "done" ?
                                <audio className="flex-1 bg-transparent border border-1 border-amber-500" src={ blobURL } controls></audio>
                                :
                                <span className="text-sm text-amber-900/50"> { recordingMessage } </span>
                            }
                        </div>
                        <div className="w-16 h-16">
                                <button className={
                                    recordingState === "recording" ?
                                    "w-full h-full flex items-center justify-center text-lg relative hover:border-amber-600 hover:text-amber-600 text-white bg-amber-500 border border-1 border-amber-500 transition-colors ease-in-out duration-300"
                                    :
                                    "w-full h-full flex items-center justify-center text-lg relative hover:border-amber-600 hover:text-amber-600 text-amber-500 bg-transparent border border-1 border-amber-500 transition-colors ease-in-out duration-300"

                                } 
                                                    onClick={handleRecordButtonClick}>
                                    {
                                        recordingState === "idle" ? 
                                        <FiMic className=""/>
                                        :
                                        recordingState === "recording" ? 
                                        <FiSquare className=""/>
                                        :
                                        recordingState === "done" ? 
                                        <FiRotateCcw className=""/>
                                        :
                                        <p>error: recording state: {recordingState}</p>
                                    }
                                </button> 
                        </div>
                    </div>
                </div>
            </div>
    )
}



export default AudioRecorder