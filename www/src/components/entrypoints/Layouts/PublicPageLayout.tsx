import { PropsWithChildren } from "react";
import AirContext from "../../../contexts/AirContext";

interface PulicPageLayoutProps extends PropsWithChildren {

} 

function PulicPageLayout({ children } : PulicPageLayoutProps) {
	return ( 
		<AirContext>
			<div className="w-screen h-screen overflow-y-scroll p-4
							bg-amber-100
							text-amber-900 font-serif">
				<div className="w-full">
					{ children }
				</div>
			</div>
		</AirContext>
	 );
}

export default PulicPageLayout;