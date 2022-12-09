
interface MiniUserProps {
	name1: string,
	mark1: string,
	name2: string,
	mark2: string,
}

function MiniDualUser({ name1, mark1, name2, mark2} : MiniUserProps) {
	return (
		<div className="h-full flex items-center gap-2">
			<p>
				{ name1 }
			</p>
			<div className="relative w-8 h-8 ">
				<img className="absolute w-full h-full object-contain"
						src={`${process.env.REACT_APP_SPACES_URL}/${mark1}`}
						alt="partner1's mark">
				</img>
				<img className="absolute w-full h-full object-contain"
						src={`${process.env.REACT_APP_SPACES_URL}/${mark2}`}
						alt="partner1's mark">
				</img>
			</div>
			<p>
				{ name2 }
			</p>
		</div>);
}

export default MiniDualUser;