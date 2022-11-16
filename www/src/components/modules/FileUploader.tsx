import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IFile } from "../../utils/types"

interface IFileUploadProps {
    type: string,
    maxUploads?: number,
    setUploads: Dispatch<SetStateAction<IFile[]>>,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const FileUploader = ({ type, maxUploads = 1, setUploads, setUserDone, hasUserCompleted }: IFileUploadProps) => {
    const [files, setFiles] = useState(Array<IFile>)
    const [uploadIndex, setUploadIndex] = useState(1)
    useEffect(() => {
        setUserDone(false)
    }, [])

    useEffect(() => {
        if (files.length > 0) {
            if (uploadIndex < maxUploads) {
                let u = uploadIndex + 1
                setUploadIndex(u)
            } else if (files.length == maxUploads) {
                setUploads(files)
                setUserDone(true)
            }
        }

        console.log(files.length, maxUploads);

    }, [files])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement

        if (t.files != null) {
            let f = {
                file: t.files[0],
                text: ""
            } as IFile

            setFiles([...files, f])
        }
    }

    const getInputFields = () => {
        let fields = []
        for (let i = 0; i < uploadIndex; i++) {
            fields.push(<input key={`fileinput-${i}`} type="file" capture="environment" accept={`${type}/*`} onChange={handleFileChange} />)
        }

        return fields
    }

    return (<>
        <p>
            {
                getInputFields()
            }
        </p>
    </>)
}

export default FileUploader