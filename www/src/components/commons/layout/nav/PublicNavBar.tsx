import Logo from "../../logo/Logo";
import { Link } from "react-router-dom";
import MainMenu from "../../menu/MainMenu";

function PublicNavBar() {
	return ( 
		<>
			<MainMenu publicPage={true} />
			<div className="w-full h-16 p-2 pl-4 pr-4
						absolute
						flex items-center justify-between
						backdrop-blur-sm">
				<Link to="/">
					<Logo />
				</Link>
			</div>
		</>
	 );
}

export default PublicNavBar;