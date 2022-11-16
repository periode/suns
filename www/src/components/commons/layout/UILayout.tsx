import { IEntrypoint } from "../../../../src/utils/types";
import Entrypoint from "../../entrypoints/Entrypoint";

interface UILayoutProps
{
	currentEntrypoint : IEntrypoint
}

const UILayout = ({currentEntrypoint} : UILayoutProps) => {
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