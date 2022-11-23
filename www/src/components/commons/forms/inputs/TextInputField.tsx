import { useEffect, useRef, useState } from "react";
import { IFile } from "../../../../utils/types";

interface TextInputFieldProps {
	label? : string,
	placeholder? : string,
	type? : string
	handleNewUploads: Function,
	isRequestingUploads: boolean,
    handleUserDone: Function,
	hasUserCompleted: boolean,
}

const TextInputField = ({
	label,
	placeholder,
	handleNewUploads,
	isRequestingUploads,
	handleUserDone,
	hasUserCompleted
 } : TextInputFieldProps) => {
	const hasSignifiedDone = useRef(false)
	const [uploads, setUploads] = useState(Array<IFile>)
	useEffect(() => {
        handleUserDone(false)
    }, [])

	useEffect(() => {
		if(isRequestingUploads)	
			handleNewUploads(uploads)
		
	}, [isRequestingUploads])


	// Check when erasing if value is now below 10, then update userDone
	const onChange = (e: React.BaseSyntheticEvent) => {
		const t = e.target as HTMLInputElement
		e.preventDefault()
        e.stopPropagation()
		
		if (t.value.length > 10 && hasSignifiedDone.current == false){
			setUploads([{file: undefined, text: t.value}])
			handleUserDone(true)
			hasSignifiedDone.current = true
		}
	}

	return ( 
		<>
			{
				label &&
				<label	className="
						disabled:opacity-50" 
						htmlFor={ label?.toLowerCase() }>{ label }</label>
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
				onChange={onChange} placeholder={placeholder} name={ label? label.toLowerCase() : 'text' } disabled={ hasUserCompleted }/>
		</>						
	)	
}

export default TextInputField;