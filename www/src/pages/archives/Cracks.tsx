import { useEffect, useRef, useState } from "react";
import { FiX, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ENTRYPOINT_STATUS, IEntrypoint } from "../../utils/types";
import Crack from "./Crack";

export interface ICrack {
    url: string,
    uuid: string,
    generation: number,
    sacrifice_wave: number,
    user_name: string,
}

const Cracks = () => {
    const navigate = useNavigate()
    const hasData = useRef(false);
    const [crackEntrypoints, setCrackEntrypoints] = useState<IEntrypoint[]>()
    const [cracks, setCracks] = useState<ICrack[]>()

    useEffect(() => {
        if (hasData.current === false) {
            const endpoint = new URL(`entrypoints/cracks`, process.env.REACT_APP_API_URL)
            fetch(endpoint)
                .then(res => {
                    if (res.ok)
                        return res.json()
                    else
                        console.error(res)
                })
                .then((data: IEntrypoint[]) => {
                    setCrackEntrypoints(data)
                })
                .catch(err => {
                    console.warn('error', err)
                })
            hasData.current = true
        }
    }, [])

    useEffect(() => {
        if (crackEntrypoints == undefined) return
        let crs = crackEntrypoints.map((cep) => {

            //-- find the module with the uploads attached
            let mod = cep.modules.filter(m => m.name === "Cracks - Donating a picture")
            return {
                url: mod[0].uploads[0].url,
                uuid: cep.uuid,
                sacrifice_wave: cep.sacrifice_wave,
                generation: cep.generation,
                user_name: cep.users[0].name
            }
        })

        setCracks(crs)
    }, [crackEntrypoints])

    return (<>
        <div className="absolute z-20 w-full h-full p-4 
                            md:flex md:flex-col md:items-center md:justify-center ">
            <div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-slate-500 
                        text-slate-900
                        bg-slate-50
                        ">
                <div className="w-full
                                flex justify-between p-4 items-center
                                border-b border-slate-500 text-slate-500">

                    <div className="full flex items-center gap-4  ">
                        <FiZap className="text-[32px]" />
                        <h1 className="text-xl font-bold">Cracks</h1>
                    </div>
                    <div className="cursor-pointer" onClick={() => navigate('/', { replace: true })}>
                        <FiX className="text-[32px]" />
                    </div>
                </div>
                <div className="   w-full p-4
                                     flex items-start justify-start flex-wrap gap-4 " >
                    {cracks?.map(c => {
                        return (<Crack data={c}/>)
                    })}
                    {cracks?.map(c => {
                        return (<Crack data={c}/>)
                    })}
                    {cracks?.map(c => {
                        return (<Crack data={c}/>)
                    })}
                    {cracks?.map(c => {
                        return (<Crack data={c}/>)
                    })}
                </div>
            </div>
        </div>
    </>)
}

export default Cracks;