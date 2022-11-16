// needs setUploads, needsPreview

import React, { Dispatch, SetStateAction, useEffect } from "react"
import { IFile } from "../../utils/types"

interface IFileUploadProps {
    type: string,
    setUploads: Dispatch<SetStateAction<IFile[]>>,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const FileUploader = ({type, setUploads, setUserDone, hasUserCompleted}: IFileUploadProps) => {

    useEffect(() => {
        setUserDone(false)
    }, [])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement
        console.log(t);
        console.log(t.value);
    }

    return (<>
        <p>
            <input type="file" capture="environment" accept={`${type}/*`} onChange={handleFileChange}/>
        </p>
    </>)
}

export default FileUploader