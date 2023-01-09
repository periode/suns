import { Link } from "react-router-dom";
import Logo from "../commons/logo/Logo";

function Footer() {

	const year = new Date().getFullYear();
	return (
		<footer className="w-full bottom-0 ">
			<div className="w-full h-[1px] bg-amber-700/10"></div>
			<div className="w-full flex justify-center p-8 font-mono text-sm text-amber-700">
				<div className="w-full flex max-w-[720px]">

				
					<div className="flex-1
									flex flex-col gap-2
									">
						<Link to="/about">About</Link>	
						<Link to="/team">Team</Link>	
						<Link to="/history">History</Link>	
						<Link to="/contact">Contact</Link>	
					</div>		
					<div className="flex-1
									flex flex-col gap-2">
						<Link to="/privacy">Privacy</Link>	
						<Link to="/help">Help</Link>	
						<Link to="/guidelines">Guidelines</Link>	
					</div>
					<div className="flex-1
									flex flex-col gap-2">
						<Logo/>
					</div>	
				</div>
			</div>
			<div className="w-full h-[1px] bg-amber-700/10"></div>
			<div className="w-full text-center p-2 pr-4 pl-4 font-mono text-xs text-amber opacity-50">© { year }, Joining Suns by Suite 42 </div>
		</footer>);
}

export default Footer;