import { PropsWithChildren } from "react";

function ContentTextFromCSS({ children } : PropsWithChildren ) {
	return ( 
		<p className="w-full whitespace-pre-wrap text-xl text-amber-900
		">{children}</p>
	 );
}

export default ContentTextFromCSS;