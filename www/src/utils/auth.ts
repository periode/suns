import { validateEmail } from "./helpers";

interface IUser {
    name: string,
    uuid: string,
}

var user: IUser

const ConfirmToken = async (_token : string) => {
    const endpoint = new URL('auth/confirm', process.env.REACT_APP_API_URL)
    console.log(_token)
    const h = new Headers();
    var b = new URLSearchParams();
    b.append("token", _token);
    const options = {
        method: 'POST',
        headers: h,
        body: b,
    }
    const res = await fetch(endpoint, options)
    if (res.ok)
    {
        return Promise.resolve("Confirmation successful!")
    }
    else
    {
        console.error(`Could not confirm! ${res.statusText} (removing token)`)
        return Promise.reject("We could not confirm your account.")
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
        window.location.reload()
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

const signup = async (_email: string, _email_conf: string, _password: string, _password_conf: string) => {
    const endpoint = new URL('users/', process.env.REACT_APP_API_URL)

    // check for validity
    if (_email !== _email_conf) {
        return Promise.reject("The confirmation email you've entered does not match.")
    }

    if (_password !== _password_conf) {
        return Promise.reject("The confirmation password you've entered does not match.")
    }

    if (_password.length < 8) {
        return Promise.reject("The password should be at least 8 chararcters long.")
    }

    if (!validateEmail(_email)) {
        return Promise.reject("The email you've entered is not valid.")
    }

    // create account
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
        return Promise.resolve("Account created successfully! Please check your email inbox to confirm your account.")
    } else {
        return Promise.reject("There was an error creating your account. Please try again later.")
    }
}

const getSession = () => {

    const t = sessionStorage.getItem("token")
    const u = sessionStorage.getItem("user")

    if (t == null || u == null)
        return { user: { name: '', uuid: '' }, token: '' }
    else
        return { user: JSON.parse(u), token: t }
}

export { signin, signout, signup, getSession, ConfirmToken }