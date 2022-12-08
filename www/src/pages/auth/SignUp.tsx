import { useEffect, useState } from "react"
import { FiCheck } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import LoginPrimary from "../../components/commons/buttons/LoginPrimary"
import InputField, { IValidation } from "../../components/commons/forms/inputs/InputField"
import Toaster, { ToasterType } from "../../components/commons/toaster/Toaster"
import { signin, signup } from "../../utils/auth"

interface SignUpProps {
	mark?: Blob
}

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 15

const PASSWORD_MIN_LENGTH = 8

const SignUp = ({ mark }: SignUpProps) => {

	const navigate = useNavigate()

	const [success, setSuccess] = useState(false)

	const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)

	const [message, setMessage] = useState("")
	const [canSignup, setCanSignUp] = useState(false)

	const [signupName, setSignupName] = useState("")
	const [signupEmail, setSignupEmail] = useState("")
	const [signupPassword, setSignupPassword] = useState("")
	const [signupEmailConf, setSignupEmailConf] = useState("")
	const [signupPasswordConf, setSignupPasswordConf] = useState("")
	const [checkboxGuidelines, setCheckboxGuidelines] = useState("")
	const [checkboxPreferences, setCheckboxPreferences] = useState("")
	
	const [emailsMatch, SetEmailsMatch] = useState<IValidation | null>(null)
	const [passwordMatch, SetPasswordMatch] = useState<IValidation | null>(null)

	useEffect(() => {
		if(signupName.length >= NAME_MIN_LENGTH && signupName.length < NAME_MAX_LENGTH
		&& signupEmail === signupEmailConf
		&& signupPassword.length >= PASSWORD_MIN_LENGTH && signupEmail === signupEmailConf
		&& checkboxGuidelines === "on" && checkboxPreferences === "on"){
			setCanSignUp(true)
		}else{
			setCanSignUp(false)
		}

		if (signupPassword.length >= PASSWORD_MIN_LENGTH && signupPasswordConf.length >= PASSWORD_MIN_LENGTH
			&& signupPassword !== signupPasswordConf)
			SetPasswordMatch({ok: false, message: "Passwords do not match"})
		else
			SetPasswordMatch({ok: true, message: ""})
		if (signupEmail.length >= PASSWORD_MIN_LENGTH && signupEmailConf.length >= PASSWORD_MIN_LENGTH
			&& signupEmail !== signupEmailConf)
			SetEmailsMatch({ok: false, message: "Emails do not match"})
		else
			SetEmailsMatch({ok: true, message: ""})

	}, [signupName, signupEmail, signupEmailConf, signupPassword, signupPasswordConf, checkboxPreferences, checkboxGuidelines ])

	const autoSignIn = (welcome_entrypoint_uuid: string) => {
		signin(signupEmail, signupPassword)
			.then((res: string) => {
				navigate(`/entrypoints/${welcome_entrypoint_uuid}`)
				setSuccess(true)
				setMessage(res)
			})
			.catch((err: string) => {
				setMessage(err)
				setIsToasterDisplayed(true)
			})
	}

	const handleSignup = (e: React.BaseSyntheticEvent) => {
		e.preventDefault()
		e.stopPropagation()

		signup(signupEmail, signupEmailConf, signupPassword, signupPasswordConf, signupName, mark)
			.then((res: string) => {
				setMessage(res)
				setSuccess(true)
				autoSignIn(res)
			})
			.catch((err: string) => {
				setMessage(err)
				setIsToasterDisplayed(true)
			})
	}

	const handleSignupNameChange = (e: React.BaseSyntheticEvent) => {
		const v = e.target.value as string;
		setSignupName(v)
	}


	const handleSignupEmailChange = (e: React.BaseSyntheticEvent) => {
		const v = e.target.value as string;
		setSignupEmail(v)
	}

	const handleSignupEmailConfChange = (e: React.BaseSyntheticEvent) => {
		const v = e.target.value as string;
		setSignupEmailConf(v)
	}

	const handleSignupPasswordChange = (e: React.BaseSyntheticEvent) => {
		const v = e.target.value as string;
		setSignupPassword(v)
	}

	const handleSignupPasswordConfChange = (e: React.BaseSyntheticEvent) => {
		const v = e.target.value as string;
		setSignupPasswordConf(v)
	}

	return (
		<>
			<Toaster message={message} type={success ? ToasterType.success : ToasterType.error} display={isToasterDisplayed} setDisplay={setIsToasterDisplayed} timeoutms={3000}></Toaster>
			<div className="w-full h-full font-serif bg-amber-50 overflow-y-scroll">
				<div className="w-full h-screen text-amber-900 flex items-center justify-center">
					<form className="	w-full h-full md:w-[720px] md:h-4/5
											flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleSignup}>
						<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
							<h2 className="text-6xl ">Sign up</h2>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Screen name" onChange={handleSignupNameChange} placeholder="username" type="text" minlength={NAME_MIN_LENGTH} maxlength={NAME_MAX_LENGTH} />
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Email" onChange={handleSignupEmailChange} placeholder="example@example.com" type="text" validation={emailsMatch}/>
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Comfirm Email" onChange={handleSignupEmailConfChange} placeholder="example@example.com" type="text" validation={emailsMatch}/>
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField onChange={handleSignupPasswordChange} label="Password" placeholder="••••••••" maxlength={20} minlength={PASSWORD_MIN_LENGTH} type="password" validation={passwordMatch}/>
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField onChange={handleSignupPasswordConfChange} label="Password" placeholder="••••••••" maxlength={20} minlength={PASSWORD_MIN_LENGTH} type="password" validation={passwordMatch}/>
							</div>
						</div>
						<div>
							<form id="prompts-preference">
								<fieldset>
									<div className="m-2">
										<input className="m-1" type="checkbox" id="guidelines" name="guidelines" onClick={(e => setCheckboxGuidelines(e.currentTarget.value))}/>
										<label htmlFor="guidelines">I agree that any contributions found to contain harmful content, will be immediately deleted along with my registered account.More information about our community guidelines <a className="underline" href="http://joiningsuns.online/guidelines" target="_blank" rel="noopener noreferrer">here</a>.</label>
									</div>

									<div className="m-2">
										<input className="m-1" type="checkbox" id="preferences" name="preferences" onClick={(e => setCheckboxPreferences(e.currentTarget.value))}/>
										<label htmlFor="preferences">I understand that in order to delete my account, or amend my preferences, I need to email the following address XXXXX@email.com</label>
									</div>
								</fieldset>
							</form>
						</div>
						<div className="	sticky bottom-0  md:static 
											mt-4
											flex flex-col-reverse md:flex-row w-full gap-4 bg-amber-50
											drop-shadow">
							<div className="flex-1 bottom-4">
								<LoginPrimary text="Signup" onClick={handleSignup} isEnabled={canSignup}/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default SignUp;