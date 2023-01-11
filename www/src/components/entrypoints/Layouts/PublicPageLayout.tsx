import { PropsWithChildren } from "react";
import Footer from "../../public/Footer";
import PublicNavBar from "../../commons/layout/nav/PublicNavBar";

interface PublicPageLayoutProps extends PropsWithChildren {
	noNav?: boolean;
	noFooter?: boolean;
} 

function PublicPageLayout({ children, noFooter=false, noNav=false } : PublicPageLayoutProps) {
	return ( 
		<>
			{
				!noNav &&
				<PublicNavBar />
			}
			<div className="w-screen h-screen
				bg-amber-100
				text-amber-900 font-serif">
				<div className="w-full h-full pt-20
						overflow-y-scroll
						md:flex md:flex-col md:items-center 
						">
					<div className="w-full md:max-w-[720px] p-6">

						{children}
					</div>
					
				{
					!noFooter &&
					<Footer />
				}
				</div>
			</div>
		</>
	 );
}

export default PublicPageLayout;