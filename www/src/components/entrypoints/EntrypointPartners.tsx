import { IUser, PARTNER_STATUS } from "../../utils/types";
import { FiUsers, FiUser  } from "react-icons/fi"
import { ReactElement } from "react";
import Octagon from "../../assets/svgs/Octagon";
import MiniUser from "./MiniUser";
import MiniDualUser from "./MiniDualUser";

interface EntrypointPartnersProps {
	users: Array<IUser>,
    max_users: number,
    partner_status: PARTNER_STATUS,
}

const EntrypointPartners = ({
	users,
	max_users,
	partner_status,
}: EntrypointPartnersProps) => {
	
	if (partner_status === PARTNER_STATUS.PartnerNone)
	{
			return (
				<div className="h-12 w-full
							pl-2 pr-2
							flex-1
							flex items-center justify-center
							font-mono md:text-sm text-xs">
					{
						max_users === 1 ? "1 person to get started" : max_users + " persons to get started!"
					}
				</div>
			)
	}
	else if (partner_status === PARTNER_STATUS.PartnerPartial)
	{
		return (
			<div className="h-12 w-full
							pl-2 pr-2
							flex-1
							flex items-center justify-center gap-2
							font-mono md:text-sm text-xs">
				<MiniUser name={users[0].name} mark={users[0].mark_url} />
				<p className="opacity-50">+ 1 to get started!</p>
			</div>
		)
	}
	else if (partner_status === PARTNER_STATUS.PartnerFull)
	{
		if (max_users === 1)
			return (
				<div className="h-12 w-full
							pl-2 pr-2
							flex-1
							flex items-center justify-center gap-2
							font-mono md:text-sm text-xs">
					<MiniUser name={users[0].name} mark={users[0].mark_url} />
				</div>
			)
		else if (max_users === 2)
			return (<div className="h-12 w-full
							pl-2 pr-2
							flex-1
							flex items-center justify-center gap-2
							font-mono md:text-sm text-xs">
						<div className="flex items-center justify-center">
							<MiniDualUser 
								name1={users[0].name} 
								mark1={users[0].mark_url} 
								name2={users[1].name} 
								mark2={users[1].mark_url}
					/>
						</div>
					</div>
			)
		else
			return (<>max_users = { max_users }</>)
	}
	else
		return (<>partner_status = {partner_status}</>)
}

export default EntrypointPartners;