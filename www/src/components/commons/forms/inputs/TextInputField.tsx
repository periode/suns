import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IFile } from "../../../../utils/types";

interface TextInputFieldProps {
	label? : string,
	placeholder? : string,
	type? : string
	handleNewUploads: Function,
	isRequestingUploads: boolean,
    setUserDone: Dispatch<SetStateAction<boolean>>,
	hasUserCompleted: boolean,
}

const TextInputField = ({
	label,
	placeholder,
	handleNewUploads,
	isRequestingUploads,
	setUserDone,
	hasUserCompleted
 } : TextInputFieldProps) => {

	const [uploads, setUploads] = useState(Array<IFile>)

	useEffect(() => {
        setUserDone(false)
    }, [])

	useEffect(() => {
		if(isRequestingUploads)
			handleNewUploads(uploads)

	}, [isRequestingUploads])

	const onChange = (e: React.BaseSyntheticEvent) => {
		const t = e.target as HTMLInputElement
		e.preventDefault()
        e.stopPropagation()
		
		setUploads([{file: undefined, text: t.value}])
		if (t.value.length > 10)
			setUserDone(true)
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
								focus:outline-amber-500 focus:rounded-none focus:bg-white/50
								border border-amber-900 bg-white/20 font-serif text-amber-700
								placeholder:text-amber-900/50 placeholder:font-mono
								transition-all ease-in duration-300
								"
				onChange={onChange} placeholder={placeholder} name={ label? label.toLowerCase() : 'text' } disabled={ hasUserCompleted }/>
		</>						
	)	
}

export default TextInputField;