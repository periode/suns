import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Spinner from "../../components/commons/Spinner";
import { ConfirmToken } from "../../utils/auth";


const AccountConfirm = () => {
	// Get token from URL params
	const search = useLocation().search;
	const token = new URLSearchParams(search).get('token');
	const [confirming, setConfirming] = useState(true);
	const [message, setMessage] = useState("");
	const [Success, setSuccess] = useState(false);
	
	
	useEffect(() => {
		if (token)
		{
			ConfirmToken(token).then(result => {
				setMessage(result)
				setSuccess(true)
			})
			.catch((err) => {
				setMessage(err)
			})
		}
		else
		{	
			setMessage("You should not be here")
		}
		setConfirming(false)
	}, [token])

	return ( 
		confirming ? 
		<>
			<Spinner/>
			<p>{search}</p>
			<p>{token}</p>
		</>
		:
		<>
			<h2>{ message }</h2>
			{
				Success &&
				<>
					<p>You can now login</p>
				</>
			}
		</>
	 );
}

export default AccountConfirm;