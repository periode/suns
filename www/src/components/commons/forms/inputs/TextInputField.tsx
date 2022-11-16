import { Dispatch, SetStateAction, useEffect } from "react";

interface TextInputFieldProps {
	label? : string,
	placeholder? : string,
	type? : string
	setUploads: Dispatch<SetStateAction<string>>,
    setUserDone: Dispatch<SetStateAction<boolean>>,
}

const TextInputField = ({
	label,
	placeholder,
	type = "text",
	setUploads,
	setUserDone,
 } : TextInputFieldProps) => {

	useEffect(() => {
        setUserDone(false)
    }, [])

	const onChange = (e: React.BaseSyntheticEvent) => {
		e.preventDefault()
        e.stopPropagation()

		setUploads(e.currentTarget.value)
		if (e.currentTarget.value !== "")
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
			<input className="	w-full h-14 p-1 pr-2 pl-3 
								hover:border-amber-500
								disabled:opacity-50
								focus:outline-amber-500 focus:rounded-none focus:bg-white/50
								border border-amber-900 bg-amber-50 font-mono
								placeholder:text-amber-900/50
								transition-all ease-in duration-300
								"
				onChange={onChange} placeholder={placeholder} type={type} name={ label? label.toLowerCase() : type.toLowerCase() }/>
		</>						
	)	
}

export default TextInputField;