import { PropsWithChildren } from "react";

interface PulicPageLayoutProps extends PropsWithChildren {

} 

function PulicPageLayout({ children } : PulicPageLayoutProps) {
	return ( 
		<div className="">
			{ children }
		</div>
	 );
}

export default PulicPageLayout;