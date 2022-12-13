import { FiArrowRight } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { ICrack } from "./Cracks"

const Crack = (props : any) => {
    const data = props.data as ICrack
    const navigate = useNavigate()
    return (
        <div className="group 
                        w-[calc(50%-8px)] md:w-[218px] h-60 cursor-pointer 
                        p-2  hover:bg-slate-300
                        border border-slate-500 hover:border-slate-300
                        flex flex-col gap-2
                        transition-all ease-in duration-300
                        "

            onClick={() => { navigate(`/entrypoints/${data.uuid}`) }}>
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden" >
                <img className="w-auto h-auto object-contain group-hover:grayscale transition-all ease-in duration-300"
                    alt={data.user_name + "_crack"}
                    src={`${process.env.REACT_APP_SPACES_URL}/${data.url}`} />
            </div>
            <div className="flex items-center gap-1 font-mono text-xs italic text-center place-self-end group-hover:opacity-50 justify-self-end
                            transition-all ease-in duration-300">
                <p className="font-mono text-xs italic text-center place-self-end justify-self-end">by {data.user_name}</p>
                <FiArrowRight />
            </div>
        </div>
    )
}

export default Crack;