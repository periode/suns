import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="w-full h-full 
                        flex items-center justify-center
                        bg-amber-900 text-amber-500
                        font-mono">
            <div className="w-full ">
                <h1 className="text-8xl">404</h1>
                <p>You're not supposed to be here! Maybe you coudl go <Link to="/">there</Link> instead? ¯\_(ツ)_/¯</p>    
            </div>
        </div>
    )
}

export default NotFound