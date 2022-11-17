// needs setUploads, needsPreview

import React, { Dispatch, SetStateAction, useEffect } from "react"
import { IFile } from "../../../utils/types"

interface IFileUploadProps {
    type: string,
    maxUploads?: number,
    handleNewUploads: Function,
    isRequestingUploads: boolean,
    setUserDone: Dispatch<SetStateAction<boolean>>,
    hasUserCompleted: boolean
}

const FileUploader = ({ type, maxUploads = 1, handleNewUploads, isRequestingUploads, setUserDone, hasUserCompleted }: IFileUploadProps) => {
    const [uploads, setUploads] = useState(Array<IFile>)
    const [uploadIndex, setUploadIndex] = useState(1)
    useEffect(() => {
        setUserDone(false)
    }, [])

    useEffect(() => {
        if (uploads.length > 0) {
            if (uploadIndex < maxUploads) {
                let u = uploadIndex + 1
                setUploadIndex(u)
            } else if (uploads.length == maxUploads) {
                setUserDone(true)
            }
        }
    }, [uploads])

    useEffect(() => {
		if(isRequestingUploads)
			handleNewUploads(uploads)
	}, [isRequestingUploads])

    const handleFileChange = (e: React.SyntheticEvent) => {
        const t = e.target as HTMLInputElement

        if (t.files != null) {
            let f = {
                file: t.files[0],
                text: ""
            } as IFile

            setUploads([...uploads, f])
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