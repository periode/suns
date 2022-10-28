interface IUser {
    name: string,
    uuid: string,
}

const endpoint = new URL('login', process.env.REACT_APP_API_URL)
var user : IUser

const login = async (_email: string, _password: string) => {

    var h = new Headers();
    h.append("Content-Type", "application/x-www-form-urlencoded");

    var b = new URLSearchParams();
    b.append("email", _email);
    b.append("password", _password);

    var options = {
        method: 'POST',
        headers: h,
        body: b
    };

    const res = await fetch(endpoint, options)
    if(res.ok){
        const data = await res.json()
        const token = data.token
        user = {
            uuid: data.user.uuid,
            name: data.user.name
        }
        sessionStorage.setItem("user", JSON.stringify(user))
        sessionStorage.setItem("token", token)
        window.location.reload()
        return Promise.resolve("Login successful!")
    }else{
        console.error(`Could not login! ${res.statusText} (removing token)`)
        sessionStorage.removeItem("token")
        return Promise.reject("We could not log you in.")
    }
}

const logout = () => {
    sessionStorage.removeItem("token")
    window.location.reload()
}

const getSession = () => {
    
    const t = sessionStorage.getItem("token")
    const u = sessionStorage.getItem("user")

    if(t == null || u == null)
        return {user: {name: '', uuid: ''}, token: ''}
    else
        return {user: JSON.parse(u), token: t}
}

export { login, logout, getSession }