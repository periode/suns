import React from "react";

interface ContentImageProps {
	src: string
}

function ContentImage({ src }: ContentImageProps) {

	const handleMissingImage = (e: React.BaseSyntheticEvent) => {
		const t = e.currentTarget
		t.src = `${process.env.REACT_APP_API_URL}/static/${src}`
	}
	return (
		<div className="flex items-center justify-start">
			<img className="w-auto max-h-80"
				src={`${process.env.REACT_APP_SPACES_URL}/${src}`}
				alt={src}
				onError={handleMissingImage} />
		</div>
	);
}

export default ContentImage;