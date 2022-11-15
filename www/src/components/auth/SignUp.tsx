import { useState } from "react"
import { signup } from "../../utils/auth"

const SignUp = () => {

	const [success, setSuccess] = useState(false)
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
            .catch((err : string) => {
                setMessage(err)
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
				<form className="flex flex-col w-full" action="">
					<div className="flex flex-col w-full">
						<label htmlFor="signupEmail">Email</label>
						<input className="border border-amber-800 bg-amber-50" onChange={ handleSignupEmailChange } type="text" name="signupEmail" />
					</div>
					<div className="flex flex-col w-full">
						<label htmlFor="signupEmailConf">Email</label>
						<input className="border border-amber-800 bg-amber-50" onChange={ handleSignupEmailConfChange } type="text" name="signupEmailConf" />
					</div>
					<div className="flex flex-col w-full">
						<label htmlFor="signupPassword">Password</label>
						<input className="border border-amber-800 bg-amber-50" onChange={ handleSignupPasswordChange } type="password" name="signupPassword" />
					</div>
					<div className="flex flex-col w-full">
						<label htmlFor="signupPasswordConf">Password</label>
						<input className="border border-amber-800 bg-amber-50" onChange={ handleSignupPasswordConfChange } type="password" name="signupPasswordConf" />
					</div>
					<div className="flex flex-col w-full">
						<button onClick={ handleSignup }>Sign up</button>
					</div>
				</form>
				<hr />
				<div className="status-info">{ message }</div>
			</> 
			:
			<>
				<div className="status-info">{ message }</div>
			</>

	);
}

export default SignUp;