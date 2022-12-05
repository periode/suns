import { useEffect, useState } from "react"
import { FiCheck } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import LoginPrimary from "../../components/commons/buttons/LoginPrimary"
import InputField from "../../components/commons/forms/inputs/InputField"
import Toaster, { ToasterType } from "../../components/commons/toaster/Toaster"
import { signin, signup } from "../../utils/auth"

interface SignUpProps {
	mark?: Blob
}

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 50

const PASSWORD_MIN_LENGTH = 8

const SignUp = ({ mark }: SignUpProps) => {

	console.log(mark)
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

	useEffect(() => {
		if(signupName.length > NAME_MIN_LENGTH && signupName.length < NAME_MAX_LENGTH
		&& signupEmail === signupEmailConf
		&& signupPassword.length > PASSWORD_MIN_LENGTH && signupEmail === signupEmailConf
		&& checkboxGuidelines === "on" && checkboxPreferences === "on"){
			setCanSignUp(true)
		}else{
			setCanSignUp(false)
		}

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
			<div className="w-full h-full font-serif">
				<Toaster message={message} type={success ? ToasterType.success : ToasterType.error} display={isToasterDisplayed} setDisplay={setIsToasterDisplayed} timeoutms={3000}></Toaster>
				<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
					<form className="	w-full h-full md:w-[720px] md:h-4/5
											flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleSignup}>
						<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
							<h2 className="text-6xl ">Sign up</h2>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Screen name" onChange={handleSignupNameChange} placeholder="Mohammed Li" type="text" />
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Email" onChange={handleSignupEmailChange} placeholder="example@example.com" type="text" />
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField label="Comfirm Email" onChange={handleSignupEmailConfChange} placeholder="example@example.com" type="text" />
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField onChange={handleSignupPasswordChange} label="Password" placeholder="••••••••" type="password" />
							</div>
							<div className="flex flex-col gap-1 items-start w-full">
								<InputField onChange={handleSignupPasswordConfChange} label="Password" placeholder="••••••••" type="password" />
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
						<div className="sticky bottom-4 md:static 
											flex flex-col-reverse md:flex-row w-full gap-4">
							<div className="flex-1">
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