
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
			className="aspect-video"
				title={title}
			src={src}
				style={{ width: "100%", height: "100%" }}
				allow="autoplay; fullscreen; picture-in-picture"
			></iframe>
	 );
}

export default ContentVideoExternal;