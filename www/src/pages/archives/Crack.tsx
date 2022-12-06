import { useNavigate } from "react-router-dom"
import { ICrack } from "./Cracks"

const Crack = (props : any) => {
    const data = props.data as ICrack
    const navigate = useNavigate()
    return (
        <div className="p-2 w-60 h-60 cursor-pointer" onClick={() => {navigate(`/entrypoints/${data.uuid}`)}}>
            <div><img src={`${process.env.REACT_APP_SPACES_URL}/${data.url}`}/></div>
            <div>by {data.user_name}</div>
        </div>
    )
}

export default Crack;