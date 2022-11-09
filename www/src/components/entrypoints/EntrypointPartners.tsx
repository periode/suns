import { IUser, PARTNER_STATUS } from "./Entrypoint";

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

	const checkUserName = (user : IUser) : string => {
		if (user.uuid === sessionUserUuid)
			return "you"
		else
			return user.name
	}

	var userString : string;

	if		(partner_status === PARTNER_STATUS.PartnerNone)
		return <></>
	else if (partner_status === PARTNER_STATUS.PartnerPartial)
		userString = checkUserName(users[0])
	else if (partner_status === PARTNER_STATUS.PartnerFull)
	{
		if (max_users === 1)
			userString = checkUserName(users[0])
		if (max_users === 2)
			userString = checkUserName(users[0]) + "and " + checkUserName(users[1])
		else
			userString = "max_users: " + max_users
	}
	else
		userString = "Partner status: " + partner_status 

	return ( 
		<div className="h-12
						pl-4 pr-4
						relative
						flex items-center justify-center
						border-t border-amber-800">
			<p>Owned by: {userString}</p>
		</div>
	 );
}

export default EntrypointPartners;