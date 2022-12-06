import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ENTRYPOINT_STATUS, IEntrypoint, IUser } from "../../utils/types";

interface ISacrifice {
    uuid: string,
    generation: number,
    sacrifice_wave: number,
    users: Array<IUser>,
    name: string,
}

const Sacrifice = () => {
    const hasData = useRef(false);
    const navigate = useNavigate()
    const [sacrificeEntrypoints, setSacrificeEntrypoints] = useState<IEntrypoint[]>()
    const [sacrifices, setSacrifices] = useState<ISacrifice[]>()

    useEffect(() => {
        if (hasData.current === false) {
            const endpoint = new URL(`entrypoints/sacrifice`, process.env.REACT_APP_API_URL)
            fetch(endpoint)
                .then(res => {
                    if (res.ok)
                        return res.json()
                    else
                        console.error(res)
                })
                .then((data: IEntrypoint[]) => {
                    setSacrificeEntrypoints(data)
                })
                .catch(err => {
                    console.warn('error', err)
                })
            hasData.current = true
        }
    }, [])

    useEffect(() => {
        if (sacrificeEntrypoints == undefined) return
        let sac = sacrificeEntrypoints.map((sep) => {
            return {
                uuid: sep.uuid,
                name: sep.name,
                sacrifice_wave: sep.sacrifice_wave,
                generation: sep.generation,
                users: sep.users
            }
        })

        setSacrifices(sac)
    }, [sacrificeEntrypoints])

    return (<>
        <div className="absolute z-20 w-full h-full p-4 
                            md:flex md:flex-col md:items-center md:justify-center ">
            <div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-amber-500 
                        text-amber-900
                        bg-amber-50
                        ">
                <div className="cursor-pointer"
                    onClick={() => navigate('/', { replace: true })}>
                    <FiX className="text-[32px]" />
                </div>
                <h1>This is the sacrifices</h1>
                <div>
                    {sacrifices?.map(c => {
                        return (<>
                            <div>uuid: {c.uuid}</div>
                            <div>generation: {c.generation}</div>
                            <div>sacrifice_wave: {c.sacrifice_wave}</div>
                            <div>users: {c.users.map(u => { return (<>u.name</>) })}</div>
                        </>)
                    })}
                </div>
            </div>
        </div>
    </>)
}

export default Sacrifice;