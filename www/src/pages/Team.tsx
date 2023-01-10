import { useContext } from "react";
import PulicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { AirTableContext } from "../contexts/AirContext";
import TeamMember from "../components/public/TeamMember";

function Team() {

	const ctx = useContext(AirTableContext)
    const contents = ctx.get("Team")

	return (
		<PulicPageLayout>
			<h1 className="text-6xl mb-6">Team</h1>
			<div className="w-full flex flex-wrap md:gap-8 gap-2">
				<TeamMember name={contents?.get("team_name_1")} content={contents?.get("team_content_1")} location={contents?.get("team_location_1")} url={contents?.get("team_image_1")} />
				<TeamMember name={contents?.get("team_name_2")} content={contents?.get("team_content_2")} location={contents?.get("team_location_2")} url={contents?.get("team_image_2")} />
				<TeamMember name={contents?.get("team_name_3")} content={contents?.get("team_content_3")} location={contents?.get("team_location_3")} url={contents?.get("team_image_3")} />
				<TeamMember name={contents?.get("team_name_4")} content={contents?.get("team_content_4")} location={contents?.get("team_location_4")} url={contents?.get("team_image_4")} />
				<TeamMember name={contents?.get("team_name_5")} content={contents?.get("team_content_5")} location={contents?.get("team_location_5")} url={contents?.get("team_image_5")} />
				<TeamMember name={contents?.get("team_name_6")} content={contents?.get("team_content_6")} location={contents?.get("team_location_6")} url={contents?.get("team_image_6")} />
				<TeamMember name={contents?.get("team_name_7")} content={contents?.get("team_content_7")} location={contents?.get("team_location_7")} url={contents?.get("team_image_7")} />
				<TeamMember name={contents?.get("team_name_8")} content={contents?.get("team_content_8")} location={contents?.get("team_location_8")} url={contents?.get("team_image_8")} />
				<TeamMember name={contents?.get("team_name_9")} content={contents?.get("team_content_9")} location={contents?.get("team_location_9")} url={contents?.get("team_image_9")} />
				<TeamMember name={contents?.get("team_name_10")} content={contents?.get("team_content_10")} location={contents?.get("team_location_10")} url={contents?.get("team_image_10")} />
				<TeamMember name={contents?.get("team_name_11")} content={contents?.get("team_content_11")} location={contents?.get("team_location_11")} url={contents?.get("team_image_11")} />
				<TeamMember name={contents?.get("team_name_12")} content={contents?.get("team_content_12")} location={contents?.get("team_location_12")} url={contents?.get("team_image_12")} />
			</div>
		
		</PulicPageLayout>);
}

export default Team;