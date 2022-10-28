import React, { useState } from 'react';
import { login } from '../utils/auth'
import '../Auth.css'

const Auth = () => {
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(`logging in with: ${email} - ${password}`);
        login(email, password).then(result => {
            setMessage(result)
        })
    }

    const handleEmailChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setEmail(v)
    }

    const handlePasswordChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setPassword(v)
    }

    return (
        <div className="auth-container">
            <form action="">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input onChange={handleEmailChange} type="text" name="email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input onChange={handlePasswordChange} type="password" name="password" />
                </div>
                <div className="form-group">
                    <button onClick={handleLogin}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Auth