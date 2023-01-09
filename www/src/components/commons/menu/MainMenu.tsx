import { useState } from "react";
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useNavigate } from "react-router-dom";
import EngineState from "./EngineState";
import MenuBar from "./MenuBar";


const signout = () => {
    localStorage.removeItem("token")
    window.location.reload()
}

interface MainMenuProps {
	username: string,
	markURL: string
}

const MainMenu = ({ username, markURL }: MainMenuProps) => {

	const [isCollapsed, setIsCollapsed] = useState(false)
	const navigate = useNavigate()
	return ( 
	<>
			{
				isCollapsed ?
				<div className="absolute z-10 w-full h-full
								flex flex-col
								bg-amber-100
								text-amber-900
								font-serif
								">
						{/* <div className="absolute
								w-full
								h-16 
								p-4
								flex items-center justify-between
								"
						>
							<div className="flex items-center font-mono gap-2">
								<div className="w-12 h-12">
									<img className="w-full h-full" src={`${process.env.REACT_APP_SPACES_URL}/${markURL}`} alt="usermark"/>
								</div>
								{ username }
							</div>
							<div className="cursor-pointer text-[40px]"
								onClick={() => setIsCollapsed(false)}>

								<FiX className="text-3xl"/>
							</div>
						</div> */}
						<MenuBar onClick={() => setIsCollapsed(false)}>
							<div className="flex items-center font-mono gap-2">
								<div className="w-12 h-12">
									<img className="w-full h-full" src={`${process.env.REACT_APP_SPACES_URL}/${markURL}`} alt="usermark"/>
								</div>
								{ username }
							</div>
						</MenuBar>
						<div className="w-full h-full flex flex-col items-center justify-center text-6xl regular
										">
							<div className="h-24 w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/about')}>About</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/history')}>History</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/privacy')}>Privacy</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/help')}>Help</h2>
							</div>
							<div className="h-24 w-full flex items-center justify-center cursor-pointer">
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