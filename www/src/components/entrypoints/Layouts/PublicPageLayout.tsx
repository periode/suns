import { PropsWithChildren } from "react";
import AirContext from "../../../contexts/AirContext";
import NavBar from "../../commons/layout/nav/NavBar";
import Footer from "../../public/Footer";

interface PublicPageLayoutProps extends PropsWithChildren {

} 

function PublicPageLayout({ children } : PublicPageLayoutProps) {
	return ( 
		<div className="w-screen h-screen
		bg-amber-100
		text-amber-900 font-serif">
				<NavBar />
				<div className="w-full h-full p-4 pt-20
						overflow-y-scroll
				">
					{children}
					<Footer/>
				</div>

		</div>
	 );
}

export default PublicPageLayout;