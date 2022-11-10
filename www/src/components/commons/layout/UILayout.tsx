import { EntrypointInterface } from "../../../App";
import Entrypoint from "../../entrypoints/Entrypoint";

interface UILayoutProps
{
	currentEntrypoint : EntrypointInterface
}

const UILayout = ({currentEntrypoint} : UILayoutProps) => {
	console.log("UI Layout gets rendered :)")
	return ( 
		<>
			{
                Object.keys(currentEntrypoint).length > 0 ?
                  <Entrypoint data={currentEntrypoint} />
                  :
                  <></>
            }
		</>
	 );
}

export default UILayout;