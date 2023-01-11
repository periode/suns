import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Spinner from "../../components/commons/Spinners/Spinner";
import { recoverConfirm } from "../../utils/auth";
import PublicPageLayout from "../../components/entrypoints/Layouts/PublicPageLayout";
import SpinnerSmall from "../../components/commons/Spinners/SpinnerSmall";
import InputField from "../../components/commons/forms/inputs/InputField";


const AccountRecoveryConfirm = () => {
	// Get token from URL params
	const search = useLocation().search;
	const token = new URLSearchParams(search).get('token');
	const [newPassword, setNewPassword] = useState("")
	const [requestMade, setRequestMade] = useState(false)

	const [isCheckingPassword, setIsCheckingPassword] = useState(false);
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);

	const handlePasswordChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setNewPassword(v)
    }
	
	const handleRecover = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
		setIsCheckingPassword(true)
		setRequestMade(true)
		if (token)
		{
			recoverConfirm(token, newPassword)
				.then(result => {
					setIsSuccess(true)
					setIsCheckingPassword(false)
				})
				.catch((err) => {
					setIsSuccess(false) // Prevent user from checking if email adresses are registered
					setIsCheckingPassword(false)
					setMessage(err)
				})
			}
			else
			{	
				setIsSuccess(false)
				setIsCheckingPassword(false)
				setMessage("No token provided")
		}
	}

	const noToken = <>
		<p>What are you doing here? </p>
	</>

	const recoveryForm =
	<form className="	w-full h-full md:w-[720px] md:h-4/5
									flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleRecover}>
					<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
						<h2 className="text-6xl ">Email recovery</h2>
						<div className="flex flex-col gap-1 items-start w-full">
							<InputField label="New Password" onChange={handlePasswordChange} placeholder="•••••" type="password"/>
						</div>
						
					</div>
					<div className="sticky bottom-4 md:static 
									flex flex-col-reverse md:flex-row w-full gap-4">
						<div className="flex-1">
							<button
								className=" flex items-center justify-center 
								w-full h-14 bg-amber-500 
								text-white font-mono font-bold
								hover:bg-amber-600 hover:text-amber-50
								transition-all ease-in duration-300 disabled:opacity-25"
								type="submit">Change password</button>
						</div>
					</div>
	</form>
	
	const requestStatus = <>
		<div className="">
			{
				isSuccess === true ?
				<p>Your password was changed you can now <Link className="font-bold" to="/auth">login</Link></p>
				:
				<p>{ message }</p>
			}
		</div>
	</>

	return ( 
		<div className="w-full h-full font-serif">
			<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
				{
					!token ? noToken : 
						(!isCheckingPassword 
						?
						(! requestMade ? recoveryForm : requestStatus) 
						:
						<SpinnerSmall/>)
				}
			</div>
		</div>
	 );
}

export default AccountRecoveryConfirm;