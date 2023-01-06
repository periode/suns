import { PropsWithChildren } from "react";
import AirContext from "../../../contexts/AirContext";

interface PulicPageLayoutProps extends PropsWithChildren {

} 

function PulicPageLayout({ children } : PulicPageLayoutProps) {
	return ( 
		<AirContext>
			<div className="w-screen h-screen bg-amber-100">
				<div className="w-full overflow-y-scroll">
					{ children }
				</div>
			</div>
		</AirContext>
	 );
}

export default PulicPageLayout;