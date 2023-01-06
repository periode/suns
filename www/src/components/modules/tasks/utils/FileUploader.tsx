import React, { useState, useEffect } from "react"
import { FiFileText, FiImage, FiMusic, FiVideo } from "react-icons/fi"
import { IFile, TaskDoneType, UPLOAD_TYPE } from "../../../../utils/types"
import Toaster, { ToasterType } from "../../../commons/toaster/Toaster"

interface IFileUploadProps {
    type: string,
    uuid: string,
    maxUploads?: number,
    handleNewUploads: Function,
}

const MAX_FILE_SIZE: { [key: string]: number } = {
    "img": 32,
    "vid": 300
}

const FileUploader = ({ type, uuid, maxUploads = 1, handleNewUploads }: IFileUploadProps) => {
    const [uploadIndex, setUploadIndex] = useState(1)
    const [previewSrc, setPreviewSrc] = useState("")
    const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)
    useEffect(() => {
        handleNewUploads([{ uuid: uuid, file: undefined, text: "", type: type }])
    }, [])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement
        if (t.files == null) return

        if (t.files[0].size / 1024 / 1024 > MAX_FILE_SIZE[type]) {
            setIsToasterDisplayed(true)
            return
        }

        let f = {
            uuid: uuid,
            file: t.files[0],
            text: "",
            type: type
        } as IFile

        if (type === UPLOAD_TYPE.Image)
            setPreviewSrc(URL.createObjectURL(t.files[0]))

        handleNewUploads([f])
    }

    const getInputFields = () => {
        let fields = []
        for (let i = 0; i < uploadIndex; i++) {
            fields.push(
                <input
                    key={`fileinput-${i}`}
                    type="file"
                    accept={type === "img" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                    className="font-mono text-sm w-full p-4 flex flex-col gap-4 text-amber-900 
                                file:p-2 file:pr-4 file:pl-4 file:bg-amber-100 file:border-amber-500 file:text-amber-500 file:font-semibold file:border-[1px] file:shadow-none file:border-solid file:mr-4
                                "
                />
            )
        }

        return fields
    }

    return (<div>
        <Toaster
            type={ToasterType.error}
            message={"File is too big, max size: " + MAX_FILE_SIZE[type] + "mb."}
            display={isToasterDisplayed}
            setDisplay={setIsToasterDisplayed}
            timeoutms={3000}
        />
        <div className="relative w-full h-16 bg-amber-100">
            {
                    previewSrc !== "" ?
                    <div className="absolute w-full h-full overflow-hidden">
                        <img className="absolute w-full h-full 
                                        object-center object-cover overflow-hidden"
                            src={previewSrc}
                            alt="preview">
                        </img>
                        <div className="absolute w-full h-full bg-amber-100/80"></div>
                    </div>
                    :
                    <></>
            }
            {
                <div className="absolute w-full h-full">
                    { getInputFields() }
                </div>
            }
        </div>
    </div>)
}

export default FileUploader