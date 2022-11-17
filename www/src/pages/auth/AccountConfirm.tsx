import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../../components/commons/Spinners/Spinner";
import { ConfirmToken } from "../../utils/auth";


const AccountConfirm = () => {
	// Get token from URL params
	const TokenUsed = useRef(false)
	const search = useLocation().search;
	const token = new URLSearchParams(search).get('token');
	const [confirming, setConfirming] = useState(true);
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	
	
	useEffect(() => {
		// We only want to trigger this hook on component mount.
		if (token)
		{
			if (TokenUsed.current === false)
			{
				ConfirmToken(token).then(result => {
					setMessage(result)
					setIsSuccess(true)
					setConfirming(false)
				})
				.catch((err) => {
					setMessage(err)
					setConfirming(false)
				})
				TokenUsed.current = true;
			}
			
		}
		else
		{	
			setMessage("You should not be here")
			setConfirming(false)
		}

	}, [token])

	return ( 
		confirming ? 
		<>
			<Spinner/>
		</>
		:
		<>
			<h2>{ message }</h2>
			{
				isSuccess &&
				<>
					<p>You can now login</p>
				</>
			}
		</>
	 );
}

export default AccountConfirm;