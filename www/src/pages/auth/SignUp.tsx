import { useState } from "react"
import { FiCheck } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import LoginPrimary from "../../components/commons/buttons/LoginPrimary"
import LoginSecondary from "../../components/commons/buttons/LoginSecondary"
import InputField from "../../components/commons/forms/inputs/InputField"
import Toaster, { ToasterType } from "../../components/commons/toaster/Toaster"
import { signup } from "../../utils/auth"

const SignUp = () => {

	const [success, setSuccess] = useState(false)

	const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)

	const [message, setMessage] = useState("")

	const [signupEmail, setSignupEmail] = useState("")
	const [signupPassword, setSignupPassword] = useState("")
	const [signupEmailConf, setSignupEmailConf] = useState("")
	const [signupPasswordConf, setSignupPasswordConf] = useState("")

	const handleSignup = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()

        signup(signupEmail, signupEmailConf, signupPassword, signupPasswordConf)
            .then((res : string) => {
                setMessage(res)
                setSuccess(true)
            })
			.catch((err: string) => {
				setMessage(err)
				setIsToasterDisplayed(true)
            })
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
			!success ?
			<>
				<div className="w-full h-full font-serif">
					<Toaster message={message} type={success ? ToasterType.success : ToasterType.error} display={isToasterDisplayed} setDisplay={setIsToasterDisplayed} timeoutms={3000}></Toaster>
					<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
						<form className="	w-full h-full md:w-[720px] md:h-4/5
											flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleSignup}>
							<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
								<h2 className="text-6xl ">Sign up</h2>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField label="Email" onChange={handleSignupEmailChange } placeholder="example@example.com" type="text"/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField label="Comfirm Email" onChange={handleSignupEmailConfChange } placeholder="example@example.com" type="text"/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField onChange={ handleSignupPasswordChange } label="Password" placeholder="••••••••" type="password"/>
								</div>
								<div className="flex flex-col gap-1 items-start w-full">
									<InputField onChange={ handleSignupPasswordConfChange } label="Password" placeholder="••••••••" type="password"/>
								</div>
							</div>
							<div className="sticky bottom-4 md:static 
											flex flex-col-reverse md:flex-row w-full gap-4">
								<Link className="flex-1" to="/login">
									<LoginSecondary text="Login"/>
								</Link>
								<div className="flex-1">
									<LoginPrimary text="Signup" onClick={ handleSignup } />
								</div>
							</div>
						</form>
					</div>
				</div>
			</>
			
			:

			<div className="w-full h-full font-serif">
				<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
					<p className="status-info flex flex-col md:flex-row gap-2 items-center">
						<FiCheck/> {message}
					</p>
				</div>
			</div>

	);
}

export default SignUp;