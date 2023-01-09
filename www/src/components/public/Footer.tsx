import { Link } from "react-router-dom";

function Footer() {
	return (
	<footer className="w-full flex">
		<div className="flex flex-col gap-2">
			<Link to="/about">About</Link>	
			<Link to="/team">Team</Link>	
			<Link to="/history">History</Link>	
			<Link to="/contact">Contact</Link>	
		</div>		
		<div className="flex flex-col gap-2">
			<Link to="/privacy">Privacy</Link>	
			<Link to="/help">Help</Link>	
			<Link to="/community-guidelines">Community-Guidelines</Link>	
		</div>
	</footer>);
}

export default Footer;