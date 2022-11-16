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
								text-amber-900
								font-serif
								">
						<div className="absolute top-2 right-2
								w-12 h-12 
								flex items-center justify-center
								cursor-pointer
								"
							onClick={ () => setIsCollapsed(false) }>
							<FiX className="text-2xl"/>
						</div>
						<div className="h-20 w-full
										border border-b-amber-900">

						</div>
						<div className="w-full h-full flex flex-col items-center justify-center text-6xl regular
										">
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
										font-mono
										flex flex-col items-center justify-center text-2xl
										border border-t-amber-900">
							<h2 onClick={signout}>Log out</h2>
						</div>
				</div>
					:
				<div className="absolute top-2 right-2
								w-12 h-12 
								flex items-center justify-center
								text-amber-900
								cursor-pointer"
						onClick={ () => setIsCollapsed(true) }>
					<FiMenu className="text-2xl"/>
				</div>
			}
	</> 
	);
}

export default MainMenu;