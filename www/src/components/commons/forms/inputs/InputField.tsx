
interface InputFieldProps {
	label? : string,
	placeholder? : string,
	type? : string
	onChange?: (e: React.BaseSyntheticEvent) => void,
	autocomplete? : string,
	maxlength?: number
	minlength? : number
	
}

const InputField = ({
	label,
	placeholder,
	type = "text",
	onChange,
	autocomplete,
	maxlength,
	minlength
 } : InputFieldProps) => {
	return ( 
	<>
		{
			label &&
				<label className="
					w-full flex items-center justify-between
					disabled:opacity-50" 
						htmlFor={label?.toLowerCase()}>
						<p>
							{label}
						</p>
						{
							minlength ? 
								<p className="text-xs opacity-50">min {minlength} char.</p>
								:
								<></>
						}
			</label>
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
				minLength={minlength}
			/>
	</> 
	);
}

export default InputField;