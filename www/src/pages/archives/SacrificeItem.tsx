import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../utils/types";

interface SacrificeItemProps {
	uuid: string,
	name: string,
	generation: number
	sacrifice_wave?: number
	users: IUser[]
}

function SacrificeItem(
	{
		uuid,
		name,
		generation,
		sacrifice_wave,
		users,
	}: SacrificeItemProps
) {
	const navigate = useNavigate()

	const generateString = () => {
		if (users.length == 1) {
			return (
				<div>{users[0].name} has contributed to <button className="hover:underline" onClick={() => navigate(`/archive/${uuid}`)}>{name}</button></div>
			)
		} else if (users.length == 2) {
			return (
				<div>{users[0].name} and {users[1].name} have contributed to <button className="hover:underline" onClick={() => navigate(`/archive/${uuid}`)}>{name}</button></div>
			)
		}
	}

	return (
		<div className="w-full h-12 
						flex items-start gap-2
						m-5">
			<FiUsers />
			{generateString()}
		</div>
	);
}

export default SacrificeItem;