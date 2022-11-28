
interface ContentAudioProps {
	src: string
}

function ContentAudio({src} : ContentAudioProps) {
	return ( 
		<div className="w-full ">
			<audio className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`} controls />
		</div>
	 );
}

export default ContentAudio;