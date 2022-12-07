import { useState } from "react";
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useNavigate } from "react-router-dom";


const signout = () => {
    sessionStorage.removeItem("token")
    window.location.reload()
}

interface MainMenuProps {
	username : string
}

const MainMenu = ({ username } : MainMenuProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const navigate = useNavigate()
	return ( 
	<>
			{
				isCollapsed ?
				<div className="absolute z-10 w-full h-full
								flex flex-col
								bg-amber-50 
								text-amber-900
								font-serif
								">
						<div className="absolute
								w-full
								h-16 
								p-4
								flex items-center justify-between
								"
						>
							<div className="font-mono">
								{ username }
							</div>
							<div className="cursor-pointer text-[40px]"
								onClick={() => setIsCollapsed(false)}>

								<FiX className="text-3xl"/>
							</div>
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
							<div className="h-24 w-full flex items-center justify-center">
								<h2 onClick={() => {setIsCollapsed(false); navigate(`/entrypoints/archive/sacrifice`, {replace: true})}}>
									Museum
								</h2>
							</div>
						</div>
						<div className="w-full h-24
										font-mono
										flex flex-col items-center justify-center text-2xl
										border border-t-amber-900">
							<button className="flex items-center justify-center 
							" onClick={signout}>Log out</button>
						</div>
				</div>
					:
				<div className="absolute z-10 top-2 right-2
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