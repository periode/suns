
import { useState } from "react";
import Spinner from "../../components/commons/Spinners/Spinner";
import { useLocation } from "react-router-dom"
import { recoverRequest } from "../../utils/auth";


const AccountRecovery = () => {
	const location = useLocation()
	const preFilledEmail = location.state?.preFilledEmail
	
	const [success, setSuccess] = useState(false)
	const [checkingEmail, setCheckingEmail] = useState(false)
	const [recoverEmail, setRecoverEmail] = useState(preFilledEmail)
	const handleEmailChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setRecoverEmail(v)
    }
	const handleRecover = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
		setCheckingEmail(true)
        recoverRequest(recoverEmail)
            .then(result => {
                setSuccess(true)
				setCheckingEmail(false)
            })
            .catch((err) => {
				setSuccess(true) // Prevent user from checking if email adresses are registered
				setCheckingEmail(false)
            })
    	}

	const recoveryForm = <>
		<form action="">
				<div className="">
					<label htmlFor="email">Email</label>
					<input className="border border-amber-900 bg-amber-50" onChange={ handleEmailChange } type="text" name="email" value={ recoverEmail }/>
				</div>
				<div className="form-group">
					<button onClick={ handleRecover }>Recover my account</button>
				</div>
		</form>
	</>
	const successMessage = <>
		<form action="">
				<div className="">
					<p>An email was sent to { recoverEmail }</p>
				</div>
		</form>
	</>

	return (	
		!success ? recoveryForm
		:
		(	!success && checkingEmail ?
			<Spinner/>
			:
			successMessage
		)
	);
}

export default AccountRecovery;