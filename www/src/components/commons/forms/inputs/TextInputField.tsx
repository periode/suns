import React, { useEffect, useRef, useState } from "react";
import { IFile, UPLOAD_TYPE } from "../../../../utils/types";

interface TextInputFieldProps {
	label?: string,
	placeholder?: string,
	text_type?: string
	uuid: string,
	maxLimit?: number,
	minLimit?: number,
	handleNewUploads: Function,
}

const MIN_LIMIT = 2
const MAX_LIMIT = 300

const TextInputField = ({
	label, placeholder, text_type, uuid, maxLimit, minLimit=1, handleNewUploads
}: TextInputFieldProps) => {
	const inputRef = useRef<any>(null)
	
	useEffect(() => {
		handleNewUploads([{ uuid: uuid, file: undefined, text: "", type: UPLOAD_TYPE.Text }])


		if (maxLimit === undefined || maxLimit < MIN_LIMIT)
			maxLimit = MAX_LIMIT
	}, [maxLimit])

	const handleOnChange = (e: React.BaseSyntheticEvent) => {
		if (e.target.value.length > MIN_LIMIT && inputRef.current !== null) {
			handleNewUploads([{ uuid: uuid, file: undefined, text: inputRef.current.value, type: UPLOAD_TYPE.Text }])
		}
		else
			handleNewUploads() //-- TODO we might need to pass an empty array here?
	}

	return (
		<>
			{
				label &&
				<label className="
						disabled:opacity-50"
					htmlFor={label?.toLowerCase()}>{label}</label>
			}
			{
				text_type === "area" ?
					<textarea className="	
				w-full h-full p-3 
				hover:border-amber-500
				disabled:opacity-50
				focus:outline-amber-500 focus:rounded-none  focus:invalid:outline-red-500
				border border-amber-900 bg-amber-100 font-serif text-amber-700
				placeholder:text-amber-900/50 placeholder:font-mono
				transition-colors ease-in duration-300
				"
						ref={inputRef} onChange={handleOnChange} placeholder={placeholder} maxLength={maxLimit} name={label ? label.toLowerCase() : 'text'} />
					:
					<input type="text" className="	
						w-full p-3 
						hover:border-amber-500
						disabled:opacity-50
						focus:outline-amber-500 focus:rounded-none 
						border border-amber-900 bg-amber-100 font-serif text-amber-700
						placeholder:text-amber-900/50 placeholder:font-mono
						transition-colors ease-in duration-300
						"
						ref={inputRef} onChange={handleOnChange} placeholder={placeholder} maxLength={maxLimit} minLength={minLimit} name={label ? label.toLowerCase() : 'text'} />
			}
			<p>Please input at least {MIN_LIMIT} characters.</p>
		</>
	)
}

export default TextInputField;