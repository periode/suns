
import { useState } from "react";
import Spinner from "../../components/commons/Spinners/Spinner";
import { useLocation } from "react-router-dom"
import { recoverRequest } from "../../utils/auth";
import PublicPageLayout from "../../components/entrypoints/Layouts/PublicPageLayout";
import SpinnerSmall from "../../components/commons/Spinners/SpinnerSmall";
import InputField from "../../components/commons/forms/inputs/InputField";


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

	const recoveryForm =
				<form className="	w-full h-full md:w-[720px] md:h-4/5
									flex flex-col p-4 justify-between md:justify-center md:gap-4" onSubmit={handleRecover}>
					<div className="flex flex-col items-start justify-center w-full h-full md:h-auto gap-4">
						<h2 className="text-6xl ">Email recovery</h2>
						<div className="flex flex-col gap-1 items-start w-full">
							<InputField label="Email" onChange={handleEmailChange} placeholder="example@example.com" type="text" autocomplete="email"/>
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
								type="submit">Recover my account</button>
						</div>
					</div>
				</form>
	
	const successMessage = <>
		<div className="w-full text-center">
			<p>An email was sent to { recoverEmail }</p>
		</div>
	</>

	return (	
		<div className="w-full h-full font-serif">
			<div className="bg-amber-50 w-full h-screen text-amber-900 flex items-center justify-center">
			{
				!success ? recoveryForm
					:
					(!success && checkingEmail ?
						<SpinnerSmall />
						:
						successMessage
					)
			}
			</div>
		</div>
	);
}

export default AccountRecovery;