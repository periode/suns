import { FiArrowRight } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { ICrack } from "./Cracks"

const Crack = (props : any) => {
    const data = props.data as ICrack
    const navigate = useNavigate()
    return (
        <div className="group 
                        w-[calc(50%-8px)] md:w-[218px] h-60 cursor-pointer 
                        rounded-sm
                        p-2  hover:bg-slate-300 bg-slate-400
                        border border-slate-500 hover:border-slate-300
                        flex flex-col gap-2
                        transition-all ease-in duration-300
                        shadow-lg 
                        "

            onClick={() => { navigate(`/entrypoints/${data.uuid}`) }}>
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-sm shadow-inner" >
                <img className="w-auto h-auto object-contain 
                                group-hover:grayscale 
                                transition-all ease-in duration-300 
                                rounded-sm"
                    alt={data.user_name + "_crack"}
                    src={`${process.env.REACT_APP_SPACES_URL}/${data.url}`} />
            </div>
            <div className="flex items-center gap-1 font-mono text-xs italic text-center place-self-end group-hover:text-blue-900 text-slate-900 justify-self-end
                            transition-all ease-in duration-300">
                <p className="font-mono text-xs italic text-center place-self-end justify-self-end">by {data.user_name}</p>
                <FiArrowRight />
            </div>
        </div>
    )
}

export default Crack;