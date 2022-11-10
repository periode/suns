import { IUser, PARTNER_STATUS } from "./Entrypoint";
import { FiUsers, FiUser  } from "react-icons/fi"

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
	
	var userString : string;

	const checkUserName = (user : IUser) : string => {
		if (user.uuid === sessionUserUuid)
			return "you"
		else
			return user.name
	}


	if (partner_status === PARTNER_STATUS.PartnerPartial)
	{	
		userString = checkUserName(users[0])
		if (max_users === 2)
			userString += "and waiting for someone else"
	}
		
	else if (partner_status === PARTNER_STATUS.PartnerFull)
	{
		if (max_users === 1)
			userString = checkUserName(users[0])
		if (max_users === 2)
			userString = checkUserName(users[0]) + " and " + checkUserName(users[1])
		else
			userString = "max_users: " + max_users
	}
	else
		userString = "Partner status: " + partner_status 

	return ( 
		<div className="h-12
						pl-4 pr-4
						relative
						flex items-center justify-center gap-2
						border-b border-amber-800">
			<div className="flex items-center
							font-mono text-sm
							gap-1">
				{
					max_users > 1 ? <FiUsers className=""/> : <FiUser className=""/>
				}
				<p>{users.length}/{max_users}</p>
			</div>
			{
				partner_status !== PARTNER_STATUS.PartnerNone &&
				<p>Owned by: {userString}</p>
			}
		</div>
	 );
}

export default EntrypointPartners;