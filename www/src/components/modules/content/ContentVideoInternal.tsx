
interface ContentVideoProps {
	title? : string,
	src?: string,
}

function ContentVideoInternal({
	title,
	src
	} : ContentVideoProps) {

	return ( 
		
		<div className="flex items-center justify-start">
			<video className="w-auto max-h-80"
				title={title}
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				controls/>
		</div>
	 );
}

export default ContentVideoInternal;