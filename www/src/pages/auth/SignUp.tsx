import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginPrimary from "../../components/commons/buttons/LoginPrimary"
import InputField from "../../components/commons/forms/inputs/InputField"
import Toaster, { ToasterType } from "../../components/commons/toaster/Toaster"
import { signin, signup } from "../../utils/auth"

interface SignUpProps {
	mark? : Blob
}

const SignUp = ({ mark } : SignUpProps) => {

	console.log(mark)
	const navigate = useNavigate()

	const [success, setSuccess] = useState(false)

	const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)

	const [message, setMessage] = useState("")

	const [signupName, setSignupName] = useState("")
	const [signupEmail, setSignupEmail] = useState("")
	const [signupPassword, setSignupPassword] = useState("")
	const [signupEmailConf, setSignupEmailConf] = useState("")
	const [signupPasswordConf, setSignupPasswordConf] = useState("")

	const autoSignIn = (welcome_entrypoint_uuid : string) => {
		signin(signupEmail, signupPassword)
			.then((res : string) => {
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
			<div className="w-full">
				<div className="w-full h-full font-serif">
					<Toaster message={message} type={success ? ToasterType.success : ToasterType.error} display={isToasterDisplayed} setDisplay={setIsToasterDisplayed} timeoutms={3000}></Toaster>
				<div className="w-full bg-amber-50 h-screen 
								text-amber-900
								flex items-center justify-center">
						<form className="w-full h-full md:w-[720px] md:h-4/5
											flex flex-col justify-between md:justify-center md:gap-4
											" onSubmit={handleSignup}>
							<div className="w-full h-full md:h-auto
										flex flex-col items-start justify-center gap-4
										overflow-y-scroll">
								<h2 className="text-6xl ">Sign up</h2>
								<div className="flex flex-col gap-1 items-start w-full">
								<InputField
									label="Username"
									onChange={handleSignupNameChange}
									placeholder="username"
									type="text"
									autocomplete="username" 
									maxlength={15}/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField 
									label="Email" 
									onChange={handleSignupEmailChange } 
									placeholder="example@example.com" 
									type="text"/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField 
									label="Comfirm Email" 
									onChange={handleSignupEmailConfChange } 
									placeholder="example@example.com" 
									type="text"/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField 
									onChange={ handleSignupPasswordChange } 
									label="Password" 
									placeholder="••••••••" 
									type="password"
									maxlength={20}/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField 
									onChange={ handleSignupPasswordConfChange } 
									label="Password" 
									placeholder="••••••••" 
									type="password"
									maxlength={20}/>
								</div>
							</div>
							<div className="sticky bottom-4 md:static 
											flex flex-col-reverse md:flex-row w-full gap-4">
								<div className="flex-1">
									<LoginPrimary text="Signup" onClick={ handleSignup } />
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
	);
}

export default SignUp;