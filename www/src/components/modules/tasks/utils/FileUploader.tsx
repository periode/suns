// needs setUploads, needsPreview

import React, { useState, useEffect } from "react"
import { IFile } from "../../../../utils/types"

interface IFileUploadProps {
    type: string,
    uuid: string,
    maxUploads?: number,
    handleNewUploads: Function,
    isRequestingUploads: boolean,
    handleTasksDone: Function,
    hasUserCompleted: boolean
}

const MAX_FILE_SIZE = 32

const FileUploader = ({ type, uuid, maxUploads = 1, handleNewUploads, isRequestingUploads, handleTasksDone, hasUserCompleted }: IFileUploadProps) => {
    const [uploads, setUploads] = useState(Array<IFile>)
    const [uploadIndex, setUploadIndex] = useState(1)
    useEffect(() => {
        handleTasksDone({key: uuid, value: false})
    }, [])

    useEffect(() => {
        if (uploads.length > 0) {
            if (uploadIndex < maxUploads) {
                let u = uploadIndex + 1
                setUploadIndex(u)
            } else if (uploads.length == maxUploads) {
                handleTasksDone({key: uuid, value: true})
            }
        }
    }, [uploads])

    useEffect(() => {
        if (isRequestingUploads)
            handleNewUploads(uploads)
    }, [isRequestingUploads])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement
        if (t.files == null) return

        if (t.files[0].size / 1024 / 1024 > MAX_FILE_SIZE) {
            console.warn("The upload file is too big! We should use the toaster here.")
            return
        }

        let f = {
            file: t.files[0],
            text: "",
            type: type
        } as IFile

        setUploads([...uploads, f])

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