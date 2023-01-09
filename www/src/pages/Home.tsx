import { useNavigate } from "react-router-dom";
import PublicPageLayout from "../components/entrypoints/Layouts/PublicPageLayout";
import { FiArrowRight } from "react-icons/fi";

function Home() {
	const navigate = useNavigate()
	return ( 

		<PublicPageLayout>
			<div className="w-full h-[80vh]
							flex items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<h1 className="text-8xl text-center">Joining Suns</h1>
					<div className="w-full flex items-center p-4 font-mono gap-4 
									md:flex-row flex-col">
						<button className=" w-full md:w-48 rounded-sm
											flex items-center justify-center gap-2
											border-2 border-amber-500 bg-amber-500 p-4 text-amber-50
											"
								onClick={() => {navigate("/welcome")}}>
							<p>Join the suns</p>
							<FiArrowRight/>
						</button>
						<button className=" w-full md:w-48 rounded-sm
											flex items-center justify-center gap-2
											border-2 border-amber-500 p-4 text-amber-500
											"
								onClick={() => {navigate("/auth")}}>
							<p>Log in</p>
							<FiArrowRight/>
						</button>
					</div>
				</div>
			</div>
		</PublicPageLayout>
		
	 );
}

export default Home;