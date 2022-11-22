interface ContentVideoProps {
	title? : string,
	src?: string,
}

function ContentVideo({
	title,
	src
	} : ContentVideoProps) {

	return ( 
		<iframe 
			className=" block w-full" 
			title={ title } 
			src={ src }  
		>
		</iframe>

	 );
}

export default ContentVideo;