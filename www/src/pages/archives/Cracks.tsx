import { ReactNode, useEffect, useRef, useState } from "react";
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
    const [cracks, setCracks] = useState<ICrack[]>([])
    const [crackGenerations, setCrackGenerations] = useState<number[]>([])

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

    //-- this registers ESC to close the modal
    useEffect(() => {
        window.addEventListener('keydown', (e : KeyboardEvent) => {
            if (e.key === "Escape")
            navigate('/', { replace: true })
        })
        return () => {
            window.removeEventListener('keydown', (e : KeyboardEvent) => {
                if (e.key === "Escape")
                navigate('/', { replace: true })
            })
        }
    })
    
    useEffect(() => {
        if (crackEntrypoints === undefined) return

        let gens = [] as Array<number>
        for (const ep of crackEntrypoints) {
            if (gens.indexOf(ep.generation) === -1)
                gens.push(ep.generation)
        }
        gens.reverse()
        setCrackGenerations(gens)

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

    const generateCracksLayoutByGeneration = () => {
        let elems = [] as Array<ReactNode>
        crackGenerations.map((gen) => {
            elems.push(<h1 className="w-full text-xl block">Generation {gen}</h1>)

            cracks?.map((c, i) => {
                if (c.generation === gen)
                    elems.push(<Crack key={"crack-" + i} data={c} />)
            })
        })



        return (elems)
    }

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
                    {

                    }
                    {cracks?.length > 0 ? generateCracksLayoutByGeneration() : <>No cracks have been donated.</>}
                </div>
            </div>
        </div>
    </>)
}

export default Cracks;