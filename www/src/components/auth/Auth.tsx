import React, { useState, useEffect } from 'react';
import { signin, signup } from '../../utils/auth'
import "../../styles/auth.css"
import { Link, useNavigate } from 'react-router-dom';
import Airtable from 'airtable';

const Auth = () => {
    const navigate = useNavigate()
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [signupEmailConf, setSignupEmailConf] = useState("")
    const [signupPasswordConf, setSignupPasswordConf] = useState("")

    // useEffect(() => {
    //     Airtable.configure({
    //         endpointUrl: 'https://api.airtable.com',
    //         apiKey: process.env.REACT_APP_AIRTABLE_KEY
    //     })
    //     var base = Airtable.base('appO4245S69TqEnGW');

    //     const nameOfSpreadsheet = 'Main'
    //     base(nameOfSpreadsheet).select().eachPage(function page(records, fetchNextPage) {
    //         // This function (`page`) will get called for each page of records.

    //         records.forEach(function(record) {
    //             if(record.get('Name') === 'signinWelcomeMessage')
    //                 setGreetingMessage(record.get('Content') as string)
    //         });

    //         // To fetch the next page of records, call `fetchNextPage`.
    //         // If there are more records, `page` will get called again.
    //         // If there are no more records, `done` will get called.
    //         fetchNextPage();

    //     }, function done(err) {
    //         if (err) { console.error(err); return; }
    //     });
    // }, [])

    const handleSignin = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()

        signin(email, password)
            .then((res : string) => {
                setMessage(res)
                setSuccess(true)
                navigate("/")
            })
            .catch((err :  string) => {
                setMessage(err)
            })
    }

    const handleSignup = (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()

        signup(signupEmail, signupEmailConf, signupPassword, signupPasswordConf)
            .then((res : string) => {
                setMessage(res)
                setSuccess(true)
            })
            .catch((err : string) => {
                setMessage(err)
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

    const handleSignupEmailChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setSignupEmail(v)
    }

    const handleSignupEmailConfChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setSignupEmailConf(v)
    }

    const handleSignupPasswordChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setSignupPassword(v)
    }

    const handleSignupPasswordConfChange = (e: React.BaseSyntheticEvent) => {
        const v = e.target.value as string;
        setSignupPasswordConf(v)
    }



    return (
        <div className="w-full">
            {
                success === true ?
                    <div className="status-info">{message}</div>
                    :
                    <>
                        <h2>Sign in</h2>
                        <form className="flex flex-col w-full" action="">
                            <div className="flex flex-col w-full">
                                <label htmlFor="email">Email</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handleEmailChange} type="text" name="email" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="password">Password</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handlePasswordChange} type="password" name="password" />
                            </div>
                            <div className="flex flex-col w-full">
                                <button onClick={handleSignin}>Login</button>
                            </div>
                        </form>
                        <div>
                            <Link to="/auth/lost-password" state={{preFilledEmail : email}}>Forgot your Password?</Link>
                        </div>
                        <hr />
                        <h2>Sign up</h2>
                        <form className="flex flex-col w-full" action="">
                            <div className="flex flex-col w-full">
                                <label htmlFor="signupEmail">Email</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handleSignupEmailChange} type="text" name="signupEmail" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="signupEmailConf">Email</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handleSignupEmailConfChange} type="text" name="signupEmailConf" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="signupPassword">Password</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handleSignupPasswordChange} type="password" name="signupPassword" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="signupPasswordConf">Password</label>
                                <input className="border border-amber-800 bg-amber-50" onChange={handleSignupPasswordConfChange} type="password" name="signupPasswordConf" />
                            </div>
                            <div className="flex flex-col w-full">
                                <button onClick={handleSignup}>Sign up</button>
                            </div>
                        </form>
                        <hr />
                        <div className="status-info">{message}</div>
                    </>
            }

        </div>
    )
}

export default Auth