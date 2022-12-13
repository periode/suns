import { IFile, IModule } from "./types";


export const assetIntro = (
    contents: Map<string, string> | undefined,
    type: string,
    ep_name: string,
    index: number,
    name: string,
) => {
		const narrationString : string | undefined = contents?.get(`${ep_name}_${type}_${index}`)
		
		if (narrationString && name)
			return narrationString.replace("{user}", name)
		else
			return name + ":"
}

export async function fetchEntrypoint(id: string, token: string) {
    const endpoint = new URL(`entrypoints/${id}`, process.env.REACT_APP_API_URL)

    const h = new Headers();
    if (token !== "")
        h.append("Authorization", `Bearer ${token}`);

    var options = {
        method: 'GET',
        headers: h
    };
    const res = await fetch(endpoint, options)
    if (res.ok) {
        const e = await res.json()
        e.modules = e.modules.sort((a: IModule, b: IModule) => { return parseInt(a.ID) - parseInt(b.ID) })
        return Promise.resolve(e)
    } else {
        return Promise.reject(res.status)
    }
}

export const submitUpload = async (token: string, uuid: string, f: IFile) => {    
    const endpoint = new URL(`uploads/`, process.env.REACT_APP_API_URL)

    const h = new Headers();
    h.append("Authorization", `Bearer ${token}`);

    const b = new FormData()
    b.append("module_uuid", uuid)
    b.append("type", f.type)

    if (f.file !== undefined)
        b.append("files[]", f.file)

    else if (f.text !== undefined)
        b.append("text[]", f.text)

    var options = {
        method: 'POST',
        headers: h,
        body: b
    };

    const res = await fetch(endpoint, options)
    if (res.ok)
        return Promise.resolve()
    else
        return Promise.reject("failed to upload file!")
}

export const progressModule = async (uuid : string, token: string) => {
    const endpoint = new URL(`entrypoints/${uuid}/progress`, process.env.REACT_APP_API_URL)
    const h = new Headers();
    h.append("Authorization", `Bearer ${token}`);

    var options = {
        method: 'PATCH',
        headers: h
    };
    const res = await fetch(endpoint, options)
    if (res.ok) {
        const updated = await res.json()

        updated.modules = updated.modules.sort((a: IModule, b: IModule) => { return parseInt(a.ID) - parseInt(b.ID) })

        return Promise.resolve(updated)
    } else {
        return Promise.reject(res.status)
    }
}