import { useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../../components/commons/Spinner";
import { recoverConfirm } from "../../utils/auth";


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

	const recoveryForm = <>
		<form action="">
				<div className="">
					<label htmlFor="email">New Password</label>
					<input className="border border-amber-900 bg-amber-50" onChange={ handlePasswordChange } type="password" name="email" />
				</div>
				<div className="form-group">
					<button onClick={ handleRecover }>Change password</button>
				</div>
		</form>
	</>
	const requestStatus = <>
		<div className="">
			{
				isSuccess === true ?
				<p>Your password was changed you can now login</p>
				:
				<p>{ message }</p>
			}
		</div>
	</>

	return ( 
			!token ? noToken : 
			(
				!isCheckingPassword ?
					(! requestMade ? recoveryForm : requestStatus) 
				:
				<Spinner></Spinner> 
			)
	 );
}

export default AccountRecoveryConfirm;