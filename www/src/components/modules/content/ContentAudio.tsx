
interface ContentAudioProps {
	src: string
}

function ContentAudio({src} : ContentAudioProps) {
	return ( 
		<div className="w-full ">
			<audio src={`${process.env.REACT_APP_API_URL}/static/${src}`} controls/>
		</div>
	 );
}

export default ContentAudio;