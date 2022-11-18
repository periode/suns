
interface ContentTextProps {
	text: string
}

function ContentText({text} : ContentTextProps) {
	return ( 
		<div className="w-full p-4 text-serif bg-amber-100">
			<p>{ text }</p>
		</div>
	 );
}

export default ContentText;