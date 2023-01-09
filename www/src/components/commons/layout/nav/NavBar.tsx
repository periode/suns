import { FiMenu } from "react-icons/fi";
import Logo from "../../logo/Logo";

function NavBar() {
	return ( 
		<div className="w-full h-16 p-2 pl-4 pr-4
						absolute
						flex items-center justify-between
						backdrop-blur-sm">
			<Logo />
			<FiMenu/>
		</div>
	 );
}

export default NavBar;