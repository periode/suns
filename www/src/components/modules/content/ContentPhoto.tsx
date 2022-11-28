
interface ContentPhotoProps {
	src: string
}

function ContentPhoto({src} : ContentPhotoProps) {
	return ( 
		<div className="flex items-center justify-start">
			<img className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				alt={src}/>
		</div>
	 );
}

export default ContentPhoto;