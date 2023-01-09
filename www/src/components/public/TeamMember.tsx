interface TeamMemberProps {
	name?: string;
	location?: string;
	url?: string;
 }

function TeamMember(
	{ name="", location="", url="" }: TeamMemberProps,
) {
	
	
	return (
		<div className="">
			<img src={url} alt={name} />
			<p> {name}</p>
			<p> {location}</p>
		</div>
	);
}

export default TeamMember;