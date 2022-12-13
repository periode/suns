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
							font-mono text-sm">
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
							font-mono text-sm">
				<MiniUser name={users[0].name} mark={users[0].mark_url} />
				<p className="opacity-50">+ 1 person to get started!</p>
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
							font-mono text-sm">
					<MiniUser name={users[0].name} mark={users[0].mark_url} />
				</div>
			)
		else if (max_users === 2)
			return (<div className="h-12 w-full
							pl-2 pr-2
							flex-1
							flex items-center justify-center gap-2
							font-mono text-sm">
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
	// 	<div className="h-12 w-full
	// 					pl-2 pr-2
	// 					flex-1
	// 					flex items-center justify-between gap-2">
	// 		<div className="flex-1 w-full flex items-center gap-2 ">
	// 			<div className="relative w-8 h-8 ">
	// 				{
	// 					partner_status !== PARTNER_STATUS.PartnerNone &&
	// 					<img className="absolute w-full h-full object-contain"
	// 							src={`${process.env.REACT_APP_SPACES_URL}/${users[0].mark_url}`}
	// 							alt="partner1's mark">
	// 					</img>
	// 				}
	// 				<div className="w-full h-full fill-amber-100 ">
	// 					<Octagon/>
	// 				</div>
	// 			</div>
	// 			<div className="flex-1 h-6 border-b-[1px] border-amber-900
	// 							flex items-center "
	// 				style={{ opacity: opacityLeft}}>
	// 				<p className="font-mono text-sm">
	// 					{
	// 						users[0] ? users[0].name : <></>
	// 					}
	// 				</p>
	// 			</div>
	// 		</div>
	// 			{
	// 				max_users > 1 &&
	// 				<div className="flex-1 w-full  flex flex-row-reverse items-center gap-2"
	// 					style={{ opacity: opacityRight}}>
	// 					<div className="relative w-8 h-8 fill-amber-200">
	// 					{
	// 						partner_status === PARTNER_STATUS.PartnerFull &&
	// 						<img className="w-full h-full" src={`${process.env.REACT_APP_SPACES_URL}/${users[1].mark_url}`} alt="partner1's mark"></img>
	// 					}
	// 						<div className="absolute w-full h-full flex items-center justify-center fill-amber-200">
	// 							<div className="absolute font-mono">?</div>
	// 							<Octagon />
	// 						</div>
	// 					</div>
	// 					<div className="flex-1 h-6 border-b-[1px] bg-amber-200 border-amber-900
	// 									flex items-center pl-2 pr-2">
	// 						<p className="font-mono text-sm text-right w-full">
	// 								{
	// 									users[1] ? users[1].name : "free"
	// 								}
	// 						</p>
	// 					</div>
	// 				</div>
	// 			}
			
	// 	</div>
	//  );
}

export default EntrypointPartners;