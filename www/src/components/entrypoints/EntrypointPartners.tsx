import { IUser, PARTNER_STATUS } from "../../utils/types";
import { FiUsers, FiUser  } from "react-icons/fi"
import { ReactElement } from "react";

interface EntrypointPartnersProps {
	users: Array<IUser>,
    max_users: number,
    partner_status: PARTNER_STATUS,
	sessionUserUuid: string,
}

const EntrypointPartners = ( {
	users,
	max_users,
	partner_status,
	sessionUserUuid
} : EntrypointPartnersProps) => {
	
	var userString : ReactElement;

	const checkUserName = (user : IUser) : ReactElement => {
		if (user.uuid === sessionUserUuid)
			return (<span className="text-amber-500">you</span>)
		else
			return (<span>{ user.name }</span>)
	}


	if (partner_status === PARTNER_STATUS.PartnerPartial)
	{	
		userString = checkUserName(users[0])
		if (max_users === 2)
			userString = <p> { checkUserName(users[0]) } and waiting for someone else</p>
		else
			userString = checkUserName(users[0])
	}
		
	else if (partner_status === PARTNER_STATUS.PartnerFull)
	{
		if (max_users === 1)
			userString = checkUserName(users[0])
		if (max_users === 2)
			userString = <p> {checkUserName(users[0])} and { checkUserName(users[1]) } </p>
		else
			userString = <p> "max_users: " + { max_users } </p>
	}
	else
		userString = <p> "Partner status: " + { partner_status }  </p>

	return ( 
		<div className="h-12
						pl-4 pr-4
						relative
						flex-1
						flex items-center justify-center gap-2
						">
			<div className="flex items-center
							font-mono text-md
							gap-1">
				{
					max_users > 1 ? <FiUsers className="text-lg"/> : <FiUser className="text-lg"/>
				}
				<p>{users.length}/{max_users}</p>
			</div>
			{
				partner_status !== PARTNER_STATUS.PartnerNone &&
				<span>{userString}</span>
			}
		</div>
	 );
}

export default EntrypointPartners;