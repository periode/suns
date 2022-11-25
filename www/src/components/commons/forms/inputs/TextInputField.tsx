import React, { useEffect, useRef, useState } from "react";
import { IFile } from "../../../../utils/types";

interface TextInputFieldProps {
	label?: string,
	placeholder?: string,
	type?: string
	maxLimit?: number,
	handleNewUploads: Function,
	isRequestingUploads: boolean,
	handleUserDone: Function,
	hasUserCompleted: boolean,
}

const MIN_LIMIT = 2

const TextInputField = ({
	label,
	placeholder,
	maxLimit,
	handleNewUploads,
	isRequestingUploads,
	handleUserDone,
	hasUserCompleted
}: TextInputFieldProps) => {
	const hasSignifiedDone = useRef(false)
	const [uploads, setUploads] = useState(Array<IFile>)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	useEffect(() => {
		handleUserDone(false)
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
		if (e.target.value.length > MIN_LIMIT && hasSignifiedDone.current == false) {
			handleUserDone(true)
			hasSignifiedDone.current = true
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
				ref={inputRef} onChange={handleOnChange} placeholder={placeholder} maxLength={maxLimit} name={label ? label.toLowerCase() : 'text'} disabled={hasUserCompleted} />
		</>
	)
}

export default TextInputField;