import { useContext, useEffect, useRef, useState } from "react";
import { FiX, FiZapOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AirTableContext } from "../../contexts/AirContext";
import { ENTRYPOINT_STATUS, IEntrypoint, ISacrifice, IUser } from "../../utils/types";
import SacrificeItem from "./SacrificeItem";

const Sacrifice = () => {
    const hasData = useRef(false);
    const navigate = useNavigate()
    const [sacrificeEntrypoints, setSacrificeEntrypoints] = useState<IEntrypoint[]>()
    const [sacrifices, setSacrifices] = useState<ISacrifice[]>()

    const ctx = useContext(AirTableContext)
    const contents = ctx.get("Sacrifice")

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

    //-- this registers ESC to close the modal
    useEffect(() => {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === "Escape")
                navigate('/', { replace: true })
        })
        return () => {
            window.removeEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === "Escape")
                    navigate('/', { replace: true })
            })
        }
    })

    useEffect(() => {
        if (sacrificeEntrypoints == undefined) return
        let tmp = sacrificeEntrypoints.filter(s => s.users.length > 0)
        let sac = tmp.map((sep) => {
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
                            bg-amber-50/50
                            md:flex md:flex-col md:items-center md:justify-center">
            <div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-amber-900 
                        text-amber-900
                        bg-amber-50
                        ">
                <div className="w-full
                                flex justify-between p-4 items-center
                                border-b border-amber-900 text-amber-900">
                    <div className="full flex items-center gap-4  ">
                        <FiZapOff className="text-[32px]" />
                        <h1 className="text-xl font-bold">
                            Museum of Sacrifices
                        </h1>
                    </div>
                    <div className="cursor-pointer"
                        onClick={() => navigate('/', { replace: true })}>
                        <FiX className="text-[32px]" />
                    </div>
                </div>
                <div>
                    <div className="m-5 text-center">{contents?.get("info_museum")}</div>
                    <div className="m-5 text-center font-bold">{contents?.get("info_museum_bold")}</div>
                </div>
                <hr className="w-80 m-auto border-amber-900"/>
                <div className="overflow-y-scroll">
                    {sacrifices?.map(s => {
                        return (<SacrificeItem key={s.uuid} uuid={s.uuid} name={s.name} generation={s.generation} users={s.users} />)
                    })}
                </div>
            </div>
        </div>
    </>)
}

export default Sacrifice;