import { useState } from "react";
import { FiMenu, FiX } from 'react-icons/fi'


const signout = () => {
    sessionStorage.removeItem("token")
    window.location.reload()
}



const MainMenu = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	return ( 
	<>
			{
				isCollapsed ?
				<div className="absolute w-full h-full
								flex flex-col
								bg-amber-50 
								text-amber-800
								">
						<div className="absolute top-2 right-2
								w-12 h-12 
								flex items-center justify-center
								"
							onClick={ () => setIsCollapsed(false) }>
							<FiX className="text-2xl"/>
						</div>
						<div className="h-16 w-full
										border border-b-amber-800">

						</div>
						<div className="w-full h-full flex flex-col items-center justify-center text-4xl">
							<div className="h-24 w-full flex items-center justify-center">
								<h2 >About</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center">
								<h2 >Privacy</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center">
								<h2 >Help</h2>
							</div>
						</div>
						<div className="w-full h-24
										flex flex-col items-center justify-center text-4xl">
							<h2 onClick={signout}>Log out</h2>
						</div>
				</div>
					:
				<div className="absolute top-2 right-2
								w-12 h-12 
								text-amber-800"
						onClick={ () => setIsCollapsed(true) }>
					<FiMenu className="text-2xl"/>
				</div>
			}
	</> 
	);
}

export default MainMenu;