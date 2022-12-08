import { IUser, PARTNER_STATUS } from "../../utils/types";
import { FiUsers, FiUser  } from "react-icons/fi"
import { ReactElement } from "react";
import Octagon from "../../assets/svgs/Octagon";

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
}: EntrypointPartnersProps) => {
	
	// console.log(users)
	
	// var userString : ReactElement;

	// const checkUserName = (user : IUser) : ReactElement => {
	// 	if (user.uuid === sessionUserUuid)
	// 		return (<span className="text-amber-500">you</span>)
	// 	else
	// 		return (<span>{ user.name }</span>)
	// }


	// if (partner_status === PARTNER_STATUS.PartnerPartial)
	// {	
	// 	userString = checkUserName(users[0])
	// 	if (max_users === 2)
	// 		userString = <p> { checkUserName(users[0]) } and waiting for someone else</p>
	// 	else
	// 		userString = checkUserName(users[0])
	// }
		
	// else if (partner_status === PARTNER_STATUS.PartnerFull)
	// {
	// 	if (max_users === 1)
	// 		userString = checkUserName(users[0])
	// 	else if (max_users === 2)
	// 		userString = <p> {checkUserName(users[0])} and { checkUserName(users[1]) } </p>
	// 	else
	// 		userString = <p> "max_users: " + { max_users } </p>
	// }
	// else
	// 	userString = <p> "Partner status: " + { partner_status }  </p>

	var opacityLeft	: number = 0.5;
	var opacityRight: number = 0.5;
	if (partner_status === PARTNER_STATUS.PartnerNone)
	{
		opacityLeft = 0.5
		opacityRight = 0.5
	}
	else if (partner_status === PARTNER_STATUS.PartnerPartial)
	{
		opacityLeft = 1
		opacityRight = 0.5
	}
	else
	{
		opacityLeft = 1
		opacityRight = 1
	}

	return ( 
		// <div className="h-12
		// 				pl-4 pr-4
		// 				relative
		// 				flex-1
		// 				flex items-center justify-center gap-2
		// 				">
		// 	<div className="flex items-center
		// 					font-mono text-md
		// 					gap-1">
		// 		{
		// 			max_users > 1 ? <FiUsers className="text-lg"/> : <FiUser className="text-lg"/>
		// 		}
		// 		<p>{users.length}/{max_users}</p>
		// 	</div>
		// 	{
		// 		partner_status !== PARTNER_STATUS.PartnerNone &&
		// 		<span>{userString}</span>
		// 	}
		// </div>
		<div className="h-12 w-full
						pl-2 pr-2
						flex-1
						flex items-center justify-between gap-2">
			<div className="flex-1 w-full flex items-center gap-2 ">
				<div className="relative w-8 h-8 ">
					{
						partner_status !== PARTNER_STATUS.PartnerNone &&
						<img className="absolute w-full h-full object-contain"
								src={`${process.env.REACT_APP_SPACES_URL}/${users[0].mark_url}`}
								alt="partner1's mark">
						</img>
					}
					<div className="w-full h-full fill-amber-100 ">
						<Octagon/>
					</div>
				</div>
				<div className="flex-1 h-6 border-b-[1px] border-amber-900
								flex items-center "
					style={{ opacity: opacityLeft}}>
					<p className="font-mono text-sm">
						{
							users[0] ? users[0].name : <></>
						}
					</p>
				</div>
			</div>
				{
					max_users > 1 &&
					<div className="flex-1 w-full  flex flex-row-reverse items-center gap-2">
						<div className="relative w-8 h-8 fill-amber-200">
						{
							partner_status === PARTNER_STATUS.PartnerFull &&
							<img className="w-full h-full" src={`${process.env.REACT_APP_SPACES_URL}/${users[1].mark_url}`} alt="partner1's mark"></img>
						}
							<div className="absolute w-full h-full fill-amber-100">
								<Octagon/>
							</div>
						</div>
						<div className="flex-1 h-6 border-b-[1px] border-amber-900
										flex items-center pl-2 pr-2"
							style={{ opacity: opacityRight}}>
							<p className="font-mono text-sm text-right w-full">
									{
										users[1] ? users[1].name : <>123456781212345</>
									}
							</p>
						</div>
					</div>
				}
			
		</div>
	 );
}

export default EntrypointPartners;