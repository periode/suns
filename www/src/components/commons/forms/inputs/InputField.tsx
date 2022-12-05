
interface InputFieldProps {
	label? : string,
	placeholder? : string,
	type? : string
	onChange?: (e: React.BaseSyntheticEvent) => void,
	autocomplete? : string,
	maxlength? : number
}

const InputField = ({
	label,
	placeholder,
	type = "text",
	onChange,
	autocomplete,
	maxlength
 } : InputFieldProps) => {
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
				onChange={onChange} 
				placeholder={placeholder} 
				type={type} 
				name={label ? label.toLowerCase() : type.toLowerCase()} 
				autoComplete={autocomplete || "off"}
				maxLength={maxlength}	
			/>
	</> 
	);
}

export default InputField;