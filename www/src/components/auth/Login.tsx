import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../../utils/auth";


const Login = () => {
	
	const navigate = useNavigate()
    const [success, setSuccess] = useState(false)
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

	return ( 
	<div className="bg-amber-50 h-screen text-amber-900">
		<form className="flex flex-col w-full h-full p-4 justify-between" action="">
			<div className="flex flex-col items-start justify-center w-full h-full gap-4">
				<h2 className="text-6xl ">Login</h2>
				<div className="flex flex-col gap-1 items-start w-full">
					<label className="" htmlFor="email">Email</label>
					<input className="	w-full h-14 p-1 pr-2 pl-3
										border border-amber-800 bg-amber-50 font-mono
										placeholder:text-amber-900/50
							" onChange={handleEmailChange} placeholder="enter your email" type="text" name="email" />
				</div>
				<div className="flex flex-col gap-1 items-start w-full">
					<label htmlFor="password">Password</label>
					<input className="	w-full h-14 p-1 pr-2 pl-3
										border border-amber-800 bg-amber-50 font-mono
										placeholder:text-amber-900/50
							" onChange={handlePasswordChange} placeholder="•••••" type="password" name="password" />
					<Link className="self-end text-sm" to="/auth/lost-password" state={{preFilledEmail : email}}>Forgot your Password?</Link>
				</div>
			</div>

			<div className="flex flex-col w-full gap-4">
				<button className="flex items-center justify-center w-full h-14 bg-transparent text-amber-500 font-mono font-bold border borde-1 border-amber-500">
					Sign up
				</button>
				<button className="flex items-center justify-center w-full h-14 bg-amber-500 text-amber-100 font-mono font-bold"
						onClick={handleSignin}>
					Login
				</button>
			</div>
		</form>
	</div> );
}

export default Login;