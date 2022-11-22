import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../../utils/auth";
import LoginPrimary from "../commons/buttons/LoginPrimary";
import LoginSecondary from "../commons/buttons/LoginSecondary";
import InputField from "../commons/forms/inputs/InputField";
import Toaster, { ToasterType } from "../commons/toaster/Toaster";


const Login = () => {
	
	const navigate = useNavigate()
    const [success, setSuccess] = useState(false)
    const [isToasterDisplayed, setIsToasterDisplayed] = useState(false)
    const [message, setMessage] = useState("")

	const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

	const handleSignin = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()

        signin(email, password)
            .then((res : string) => {
                setMessage(res)
                setSuccess(true)
                navigate("/")
            })
            .catch((err :  string) => {
				setMessage(err)
				setIsToasterDisplayed(true)
            })
    }

	const handleEmailChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setEmail(v)
    }

    const handlePasswordChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setPassword(v)
    }

	const handleSignup = () => {
		navigate("/welcome")
	}

	return ( 
		<>
			<Toaster message={message} type={success ? ToasterType.success : ToasterType.error} display={isToasterDisplayed} setDisplay={setIsToasterDisplayed} timeoutms={3000}></Toaster>
			<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
				<form className="	w-full h-full md:w-[720px] md:h-4/5
									flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleSignin}>
					<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
						<h2 className="text-6xl ">Login</h2>
						<div className="flex flex-col gap-1 items-start w-full">
							<InputField label="Email" onChange={handleEmailChange} placeholder="example@example.com" type="text"/>
						</div>
						<div className="flex flex-col gap-1 items-start w-full">
							<InputField onChange={handlePasswordChange} label="Password" placeholder="•••••" type="password"/>
							
							<Link className="font-mono self-end text-xs hover:text-amber-500 transition-all ease-in duration-300" to="/auth/lost-password" state={{preFilledEmail : email}}>Forgot your Password?</Link>
						</div>
					</div>
					<div className="sticky bottom-4 md:static 
									flex flex-col-reverse md:flex-row w-full gap-4">
						<LoginPrimary text="Login" onClick={handleSignin}/>
						<LoginSecondary text="Sign up" onClick={handleSignup}/>
					</div>
				</form>
			</div>
		</>
	)
}

export default Login;