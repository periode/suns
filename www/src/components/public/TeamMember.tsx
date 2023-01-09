interface TeamMemberProps {
	name?: string;
	location?: string;
	content?: string;
	url?: string;
 }

function TeamMember(
	{ name="", location="", content="",url="" }: TeamMemberProps,
) {
	
	
	return (
		<div className="flex flex-col md:flex-row w-full md:gap-4">
			<img className="w-20 h-20 md:w-40 md:h-40 object-contain md:block hidden " src={`${process.env.REACT_APP_SPACES_URL}/artists/${url}`} alt={name} />
			<div className="w-full flex flex-col gap-1 p-2">
				<div className="w-full flex items-center justify-between">
					<p className="text-lg font-bold"> {name}</p>
					<p className="font-mono text-sm"> {location}</p>
				</div>
				<p className="text-sm"> { content }</p>
			</div>
		</div>
	);
}

export default TeamMember;