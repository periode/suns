import { useState } from "react";
import { FiMenu } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import { getSession } from "../../../utils/auth";
import Logo from "../logo/Logo";


const signout = () => {
    localStorage.removeItem("token")
    window.location.reload()
}

interface MainMenuProps {
	username?: string,
	markURL?: string,
	publicPage?: boolean,
}

const MainMenu = ({ username = "", markURL = "", publicPage = false }: MainMenuProps) => {

	const [isCollapsed, setIsCollapsed] = useState(false)
	const navigate = useNavigate()

	const session = getSession()

	return ( 
	<>		
			{
				isCollapsed ?
				<div className="absolute z-10 w-full h-full md:w-96 
									right-0 top-0
									md:border-l border-amber-900
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
								{
									session.user.debug_account && !publicPage ? 
									<div className="flex items-center font-mono gap-2">
										<div className="w-12 h-12">
											<img className="w-full h-full" src={`${process.env.REACT_APP_SPACES_URL}/${markURL}`} alt="usermark"/>
										</div>
										{ username }
									</div>
									:
										<div className="flex items-center font-mono gap-2">
											<div className="">
												<Logo />
											</div>
											<p>Joining Suns</p>	
									</div>
								}
							</div>
						</MenuBar>
						<div className="w-full h-full flex flex-col items-center justify-center text-5xl regular
										gap-8">
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/about')}>About</h2>
							</div>
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/help')}>Help</h2>
							</div>
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/team')}>Team</h2>
							</div>
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/history')}>History</h2>
							</div>
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/privacy')}>Privacy</h2>
							</div>
							<div className="w-full flex items-center justify-center cursor-pointer">
								<h2 onClick={() => navigate('/history')}>Contact</h2>
							</div>
						</div>
						{
							!publicPage &&
							<div className="w-full h-24
											font-mono
											flex flex-col items-center justify-center text-2xl
											border border-t-amber-900">
								<button className="flex items-center justify-center 
								" onClick={signout}>Log out</button>
							</div>
						}
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