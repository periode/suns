import React, { useState, useEffect } from "react"
import { IFile, TaskDoneType } from "../../../../utils/types"
import Toaster, { ToasterType } from "../../../commons/toaster/Toaster"

interface IFileUploadProps {
    type: string,
    uuid: string,
    maxUploads?: number,
    handleNewUploads: Function,
}

const MAX_FILE_SIZE = 32

const FileUploader = ({ type, uuid, maxUploads = 1, handleNewUploads }: IFileUploadProps) => {
    const [uploadIndex, setUploadIndex] = useState(1)
    const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)
    useEffect(() => {
        handleNewUploads([{uuid: uuid, file: undefined, text: "", type: type}])
    }, [])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement
        if (t.files == null) return

        if (t.files[0].size / 1024 / 1024 > MAX_FILE_SIZE) {
            setIsToasterDisplayed(true)
            return
        }

        let f = {
            uuid: uuid,
            file: t.files[0],
            text: "",
            type: type
        } as IFile

        handleNewUploads([f])
    }

    const getInputFields = () => {
        let fields = []
        for (let i = 0; i < uploadIndex; i++) {
            fields.push(
                <input 
                key={`fileinput-${i}`} 
                type="file"
                capture="environment" 
                accept={`${type}/*`} 
                onChange={handleFileChange}
                className="font-mono text-sm w-full bg-amber-100 p-4 flex flex-col
                "
                />
            )
        }

        return fields
    }

    return (<>
        <Toaster
            type={ ToasterType.error }
            message={"File is too big, max size: " + MAX_FILE_SIZE + "mb."}
            display={isToasterDisplayed} 
            setDisplay={setIsToasterDisplayed} 
            timeoutms={3000}
        />
            {
                getInputFields()
            }
            </>)
}

export default FileUploader