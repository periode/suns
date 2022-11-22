
interface ContentPhotoProps {
	src: string
}

function ContentPhoto({src} : ContentPhotoProps) {
	return ( 
		<div className="w-full">
			<img src={`${process.env.REACT_APP_API_URL}/static/${src}`}
				alt={src}/>
		</div>
	 );
}

export default ContentPhoto;