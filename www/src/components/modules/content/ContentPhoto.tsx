
interface ContentPhotoProps {
	src: string
}

function ContentPhoto({src} : ContentPhotoProps) {
	return ( 
		<div className="w-full ">
			<img src={src} alt={src} />
		</div>
	 );
}

export default ContentPhoto;