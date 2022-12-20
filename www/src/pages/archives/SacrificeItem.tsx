import { IUser } from "../../utils/types";

interface SacrificeItemProps {
	uuid : string,
	generation : number
	sacrifice_wave : number
	users : IUser[]
}

function SacrificeItem(
	{
		uuid,
		generation,
		sacrifice_wave,
		users,
	}: SacrificeItemProps
) {
	return ( 
		<div className="w-full h-12 
						flex items-center justify-between gap-2
						">
			<div>{ uuid }</div>
            <div>{ generation }</div>
            <div>{ sacrifice_wave }</div>
            <div>{ users.map(u => { return (<>u.name</>) })}</div>
		</div>
	 );
}

export default SacrificeItem;