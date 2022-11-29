import React, { useEffect, useRef, useState } from "react";
import { IFile, UPLOAD_TYPE } from "../../../../utils/types";

interface TextInputFieldProps {
	label?: string,
	placeholder?: string,
	type?: string
	uuid: string,
	maxLimit?: number,
	handleNewUploads: Function,
}

const MIN_LIMIT = 2

const TextInputField = ({
	label, placeholder, uuid, maxLimit, handleNewUploads
}: TextInputFieldProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		handleNewUploads([{uuid: uuid, file: undefined, text: "", type: UPLOAD_TYPE.Text }])
	}, [])

	const handleOnChange = (e: React.BaseSyntheticEvent) => {
		if (e.target.value.length > MIN_LIMIT && inputRef.current !== null) {
			console.log(inputRef.current.value);

			handleNewUploads([{uuid: uuid, file: undefined, text: inputRef.current.value, type: UPLOAD_TYPE.Text }])
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
				ref={inputRef} onChange={handleOnChange} placeholder={placeholder} maxLength={maxLimit} name={label ? label.toLowerCase() : 'text'}/>
		</>
	)
}

export default TextInputField;