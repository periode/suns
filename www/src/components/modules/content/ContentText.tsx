
interface ContentTextProps {
	text: string
}

function ContentText({text} : ContentTextProps) {
	return ( 
		<div className="w-full p-4 text-serif bg-green-100 text-green-700
						">
			<p>{ text }</p>
		</div>
	 );
}

export default ContentText;