import React, { useEffect, useRef, useState } from "react";
import { IFile, TaskDoneType } from "../../../../utils/types";

interface TextInputFieldProps {
	label?: string,
	placeholder?: string,
	type?: string
	handleNewUploads: Function,
	isRequestingUploads: boolean,
	setTasksDone: React.Dispatch<React.SetStateAction<TaskDoneType[]>>,
	tasksDone: TaskDoneType[],
	hasUserCompleted: boolean,
	uuid : string
}

const TextInputField = ({
	label,
	placeholder,
	handleNewUploads,
	isRequestingUploads,
	setTasksDone,
	tasksDone,
	hasUserCompleted,
	uuid
}: TextInputFieldProps) => {

	const minInputLength = 10
	
	const [uploads, setUploads] = useState(Array<IFile>)

	// To get inputfield.value
	const inputRef = useRef<HTMLTextAreaElement>(null)

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
		if (isRequestingUploads)
			handleNewUploads(uploads)
	}, [uploads])

	useEffect(() => {
		if (inputRef.current == null)
			return

		setUploads([{ file: undefined, text: inputRef.current.value }])
	}, [isRequestingUploads])

	const handleOnChange = (e: React.BaseSyntheticEvent) => {

		if (e.target.value.length >= minInputLength) {
			let tmp = [...tasksDone]
			for (const task of tmp) {
				// console.log("handleOnChange: ", task)
				if (task.key === uuid) {
					task.value = true
					break
				}
			}
			setTasksDone(tmp)
		}
		else 
		{
			let tmp = [...tasksDone]
			for (const task of tmp) {
				// console.log("handleOnChangeFalse: ", task)
				if (task.key === uuid) {
					task.value = false
					break
				}
			}
			setTasksDone(tmp)
		}
	}

	return (
		<>
			{
				label &&
				<label className="
						disabled:opacity-50"
					htmlFor={label?.toLowerCase()}>{label}</label>
			}
			<textarea className="	
								w-full h-full p-3 
								hover:border-amber-500
								disabled:opacity-50
								focus:outline-amber-500 focus:rounded-none 
								border border-amber-900 bg-amber-100 font-serif text-amber-700
								placeholder:text-amber-900/50 placeholder:font-mono
								transition-colors ease-in duration-300
								"
				
				ref={inputRef} 
				onChange={handleOnChange} 
				placeholder={placeholder} 
				name={label ? label.toLowerCase() : 'text'} 
				disabled={hasUserCompleted}
				minLength={minInputLength}
				required
			/>
		</>
	)
}

export default TextInputField;