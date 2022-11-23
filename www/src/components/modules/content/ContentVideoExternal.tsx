
interface ContentVideoExternalProps {
	title? : string,
	src?: string,
}

function ContentVideoExternal({
	title,
	src
	} : ContentVideoExternalProps) {

	return ( 
			<iframe
				className="w-auto flex-1"
				title={title}
				src={src}
				//width="640"
				//height="320"
				allow="autoplay; fullscreen; picture-in-picture"
				></iframe>
	 );
}

export default ContentVideoExternal;