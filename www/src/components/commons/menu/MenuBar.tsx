import { FiX } from "react-icons/fi";

interface MenuBarProps extends React.PropsWithChildren { 
	onClick: () => void,
}


function MenuBar(
	{
		children,
		onClick,
	}
	: MenuBarProps
) {
	return (
	<div className="absolute
					w-full
					h-16 
					p-4
					flex items-center justify-between
					bg-amber-100
					border border-b-amber-900
					text-amber-900
					">
		<div>
			{ children }
		</div>
		<div	className="cursor-pointer text-3xl"
				onClick={onClick}>
			<FiX/>
		</div>
	</div>);
}

export default MenuBar;