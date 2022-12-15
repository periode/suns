import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { FiPause, FiPlay, FiRotateCcw } from "react-icons/fi";

interface AudioPlayerProps {
	src: string | undefined,
	final?: boolean 
}

function AudioPlayer({ src, final=false }: AudioPlayerProps) {
	
	const [isPlaying, setPlaying] = useState(false)
	const [time, setTime] = useState(0)


	// const audioElement?.current?: HTMLAudioElement = new Audio(src)
	const audioElement = useRef<HTMLAudioElement>(null)

	const [duration, setDuration] = useState(0)

	

	const calculateTime = (secs:number) => {
		const minutes = Math.floor(secs / 60);
		const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${returnedMinutes}:${returnedSeconds}`;
	}
	

	audioElement?.current?.addEventListener("loadeddata", () => {
		setDuration(audioElement?.current?.duration || 0)
	});

	audioElement?.current?.addEventListener("playing", () => {
		setPlaying(true)
	}, {once : true});

	audioElement?.current?.addEventListener("pause", () => {
		setPlaying(false)
	}, {once : true});

	audioElement?.current?.addEventListener("ended", () => {
		if (audioElement.current)
			audioElement.current.currentTime = 0
		setPlaying(false)
	}, {once : true});

	audioElement?.current?.addEventListener('timeupdate', () => {
  		if (audioElement.current)
			setTime(audioElement.current.currentTime);
	});

	if (audioElement.current && audioElement.current.readyState > 0)
	{
		audioElement?.current?.addEventListener('loadedmetadata', () => {
			if (audioElement.current)
				setDuration(audioElement?.current?.duration);
	});
}

	const handlePlay = () => {

		if (isPlaying)
		{
			// pause
			audioElement?.current?.pause()
			
		}
		else	
		{
			// play
			audioElement?.current?.play()
		}
	}

	const restart = () => {
		audioElement?.current?.pause()
		if (audioElement.current)
			audioElement.current.currentTime = 0
	}


	return ( 
		<div className={
			final ?
				"w-full h-full flex items-center gap-2 bg-green-200 p-2"
				:
				"w-full h-full flex items-center gap-2 bg-amber-200 p-2"

		}>
			<div className={
				final
					?
					"w-10 h-10 flex items-center justify-center cursor-pointer border border-green-500 text-green-50 bg-green-500"
					:
					"w-10 h-10 flex items-center justify-center cursor-pointer border border-amber-500 text-amber-50 bg-amber-500"
						}
							onClick={handlePlay}>
				{!isPlaying ? <FiPlay /> : <FiPause />}
				<audio ref={ audioElement } className="hidden" src={src} controls/>
			</div>
			<div className={final
				?
				"w-10 h-10 flex items-center justify-center cursor-pointer border border-green-500 text-green-500"
				:
				"w-10 h-10 flex items-center justify-center cursor-pointer border border-amber-500 text-amber-500"}
							onClick={restart}>
				<FiRotateCcw/>
			</div>
			<div className="flex-1 ">
				<div className="text-sm font-mono text-center opacity-50">
					{ calculateTime(time) } / { calculateTime(duration) }
				</div>
			</div>
		</div>
	 );
}

export default AudioPlayer;