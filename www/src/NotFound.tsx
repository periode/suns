import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <>
        <h1>Whoops.</h1>
        <p>We could not find this page</p>
        <Link to="/">Home</Link>
        </>
    )
}

export default NotFound