import { PropsWithChildren } from "react";

function ContentTextFromCSS({ children } : PropsWithChildren ) {
	return ( 
		<p className="w-full whitespace-pre-wrap text-xl leading-relaxed
		">{children}</p>
	 );
}

export default ContentTextFromCSS;