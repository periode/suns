
interface MiniUserProps {
	name: string,
	mark: string,
}

function MiniUser({ name, mark } : MiniUserProps) {
	return (
		<div className="h-full flex items-center gap-2">
			<div className="relative w-8 h-8 ">
				<img className="absolute w-full h-full object-contain"
						src={`${process.env.REACT_APP_SPACES_URL}/${mark}`}
						alt="partner1's mark">
				</img>
			</div>
				{ name }
		</div>);
}

export default MiniUser;