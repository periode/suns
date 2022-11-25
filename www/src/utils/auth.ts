import { validateEmail } from "./helpers";
import { ISession, IUser } from "./types";

var user: IUser

const ConfirmToken = async (_token: string) => {
    const endpoint = new URL('auth/confirm', process.env.REACT_APP_API_URL)
    const h = new Headers();
    var b = new URLSearchParams();
    b.append("token", _token);
    const options = {
        method: 'POST',
        headers: h,
        body: b,
    }
    const res = await fetch(endpoint, options)
    if (res.ok) {
        return Promise.resolve("Confirmation successful!")
    }
    else {
        console.error(`Could not confirm! ${res.statusText} (removing token)`)
        return Promise.reject("We could not confirm your account.")
    }
}

const recoverConfirm = async (_token: string, _password: string) => {
    const endpoint = new URL('auth/check-recover', process.env.REACT_APP_API_URL)
    const h = new Headers();

    var b = new URLSearchParams();
    b.append("token", _token);
    b.append("password", _password);
    const options = {
        method: 'POST',
        headers: h,
        body: b,
    }

    const res = await fetch(endpoint, options)
    if (res.ok) {
        return Promise.resolve("New password was created sucessfully!")
    }
    else {
        console.error(`Could not confirm! ${res.statusText} (removing token)`)
        return Promise.reject("We could not create a new password.")
    }
}

const recoverRequest = async (_email: string) => {
    const endpoint = new URL('auth/request-recover', process.env.REACT_APP_API_URL);
    var h = new Headers();
    h.append("Content-Type", "application/x-www-form-urlencoded");

    var b = new URLSearchParams();
    b.append("email", _email);

    var options = {
        method: 'POST',
        headers: h,
        body: b
    };

    const res = await fetch(endpoint, options)
    if (res.ok)
        return Promise.resolve(`${res.statusText}`)
    else {

        return Promise.reject(`${res.statusText}`)
    }
}

const signin = async (_email: string, _password: string) => {
    const endpoint = new URL('login', process.env.REACT_APP_API_URL)

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
    if (res.ok) {
        const data = await res.json()
        const token = data.token
        user = {
            uuid: data.user.uuid,
            name: data.user.name
        }
        sessionStorage.setItem("user", JSON.stringify(user))
        sessionStorage.setItem("token", token)
        return Promise.resolve("Login successful!")
    } else {
        console.error(`Could not signin! ${res.statusText} (removing token)`)
        sessionStorage.removeItem("token")
        return Promise.reject("We could not log you in.")
    }
}

const signout = () => {
    sessionStorage.removeItem("token")
    window.location.reload()
}

const signup = async (_email: string, _email_conf: string, _password: string, _password_conf: string, _name: string, _mark?: Blob) => {
    const endpoint = new URL('users/', process.env.REACT_APP_API_URL)

    // check for validity
    if (_email !== _email_conf) {
        return Promise.reject("The confirmation email you've entered does not match.")
    }

    if (_password !== _password_conf) {
        return Promise.reject("The confirmation password you've entered does not match.")
    }

    if (_password.length < 8) {
        return Promise.reject("The password should be between 8 and 20 characters long.")
    }

    if (_password.length > 20) {
        return Promise.reject("The password should be between 8 and 20 characters long.")
    }

    if (!validateEmail(_email)) {
        return Promise.reject("The email you've entered is not valid.")
    }

    if (_name.length < 2) {
        return Promise.reject("The name should be at least 2 characters long.")
    }

    var f = new FormData();
    f.append("email", _email);
    f.append("password", _password);
    f.append("name", _name);
    if(_mark)
        f.append("mark", _mark, "mark.png")
    
    var options = {
        method: 'POST',
        body: f
    };

    const res = await fetch(endpoint, options)
    if (res.ok) {
        const uuid = await res.text()
        return Promise.resolve(uuid)
    } else {
        return Promise.reject("There was an error creating your account. Please try again later.")
    }
}

const getSession = () => {
    const t = sessionStorage.getItem("token")
    const u = sessionStorage.getItem("user")
    const s: ISession = {
        token: t ? t : '',
        user: u ? JSON.parse(u) : { name: '', uuid: '' }
    }

    return s
}

export { signin, signout, signup, getSession, ConfirmToken, recoverRequest, recoverConfirm }