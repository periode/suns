import Entrypoint from "../../components/entrypoints/Entrypoint";
import AirContext from "../../contexts/AirContext";

const Archive = () => {
    return (<>
        <AirContext>
            <div className="bg-slate-300 w-screen h-screen">
                <Entrypoint />
            </div>
        </AirContext>
    </>)
}

export default Archive;