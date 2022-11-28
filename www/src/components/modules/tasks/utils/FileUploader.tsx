// needs setUploads, needsPreview

import React, { useState, useEffect } from "react"
import { IFile, TaskDoneType } from "../../../../utils/types"

interface IFileUploadProps {
    type: string,
    maxUploads?: number,
    handleNewUploads: Function,
    isRequestingUploads: boolean,
    setTasksDone: React.Dispatch<React.SetStateAction<TaskDoneType[]>>,
    tasksDone: TaskDoneType[],
    hasUserCompleted: boolean,
    uuid: string
}

const FileUploader = ({ type, maxUploads = 1, handleNewUploads, isRequestingUploads,  setTasksDone, tasksDone, hasUserCompleted, uuid }: IFileUploadProps) => {
    const [uploads, setUploads] = useState(Array<IFile>)
    const [uploadIndex, setUploadIndex] = useState(1)
    
    useEffect(() => {
        let hasFound = false
            for (const task of tasksDone) {
                if (task.key === uuid) {
                    hasFound = true
                    break
                }
            }
        if (!hasFound)
            setTasksDone([...tasksDone, { key: uuid, value: false }])
	}, [])

    useEffect(() => {
        if (uploads.length > 0) {
            if (uploadIndex < maxUploads) {
                let u = uploadIndex + 1
                setUploadIndex(u)
            } else if (uploads.length == maxUploads) {
                let tmp = tasksDone
                for (const task of tmp) {
                    if (task.key === uuid) {
                        task.value = true
                        break
                    }
                }
                setTasksDone(tmp)
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
            {
                getInputFields()
            }
            </>)
}

export default FileUploader