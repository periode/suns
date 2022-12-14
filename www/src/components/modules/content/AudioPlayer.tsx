import { MouseEventHandler, useEffect, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

interface AudioPlayerProps {
	src: string | undefined
}

function AudioPlayer({ src }: AudioPlayerProps) {
	
	const [isPlaying, setPlaying] = useState(false)
	const [time, setTime] = useState(0)
	const audioElement: HTMLAudioElement = new Audio(src)

	const [duration, setDuration] = useState(0)


	const calculateTime = (secs:number) => {
		const minutes = Math.floor(secs / 60);
		const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${returnedMinutes}:${returnedSeconds}`;
	}
	

	audioElement.addEventListener("loadeddata", () => {
		setDuration(audioElement.duration)
	});

	audioElement.addEventListener("playing", () => {
		
		setPlaying(true)
	});
	audioElement.addEventListener("ended", () => {
		audioElement.currentTime = 0
		setPlaying(false)
	});

	audioElement.addEventListener('timeupdate', () => {
  		setTime(audioElement.currentTime);
	});

	if (audioElement.readyState > 0)
	{
		audioElement.addEventListener('loadedmetadata', () => {
			setDuration(audioElement.duration);
	});
}

	const handlePlay = () => {
		if (isPlaying)
		{
			audioElement?.pause()
		}
		else	
		{
			console.log("play")
			audioElement?.play()
		}
	}

	return ( 
		<div className="w-full h-full flex items-center gap-4">
			<div className="w-16 h-16 flex items-center justify-center cursor-pointer
							border border-amber-500 text-amber-50
							bg-amber-500"
					onClick={handlePlay}>
				{ !isPlaying ? <FiPlay/> : <FiPause/> }
			</div>
			<div className="flex-1 ">
				<div className="text-sm opacity-50">
					{ calculateTime(time) } / { calculateTime(duration) }
				</div>
			</div>
		</div>
	 );
}

export default AudioPlayer;