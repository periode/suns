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
	
	
	useEffect(() => {
		if (token)
		{
			ConfirmToken(token).then(result => {
				setMessage(result)
			})
			.catch((err) => {
				setMessage(err)
			})
		}
		else
		setMessage("You should not be here")
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
		</>
	 );
}

export default AccountConfirm;