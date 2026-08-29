import {
    useState
} from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import "../css/login.css";

import {
    useAuth
} from "../context/AuthContext.jsx";


function Login() {

    const navigate =
        useNavigate();


    const {
        login,
        isAuthenticated,
        loading
    } =
        useAuth();


    const [
        email,
        setEmail
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    // ========================================
    // ALREADY LOGGED IN
    // ========================================

    if (
        !loading &&
        isAuthenticated
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // ========================================
    // LOGIN
    // ========================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            if (
                !email.trim() ||
                !password
            ) {

                setError(
                    "Email and password are required."
                );

                return;

            }


            try {

                setSubmitting(
                    true
                );


                setError(
                    ""
                );


                await login(
                    email.trim(),
                    password
                );


                navigate(
                    "/",
                    {
                        replace: true
                    }
                );


            } catch (error) {

                console.error(
                    "Login failed:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    error.message ||

                    "Unable to sign in."

                );


            } finally {

                setSubmitting(
                    false
                );

            }

        };


    return (

        <div className="login-page">


            <div className="login-background">


                <div className="login-brand-panel">


                    <div className="login-logo">

                        🚨

                    </div>


                    <h1>
                        RESQNET
                    </h1>


                    <span>
                        DISASTER RESPONSE NETWORK
                    </span>


                    <p>

                        Emergency command,
                        intelligent dispatch and
                        operational coordination.

                    </p>


                    <div className="login-system-status">

                        <span />

                        SYSTEM OPERATIONAL

                    </div>


                </div>


                <div className="login-form-panel">


                    <form
                        className="login-card"
                        onSubmit={
                            handleSubmit
                        }
                    >


                        <div className="login-card-header">

                            <span>
                                SECURE ACCESS
                            </span>


                            <h2>
                                Command Login
                            </h2>


                            <p>

                                Authenticate to access
                                the RESQNET command network.

                            </p>

                        </div>


                        {
                            error && (

                                <div className="login-error">

                                    ⚠️ {error}

                                </div>

                            )
                        }


                        <div className="login-field">

                            <label>
                                Email Address
                            </label>


                            <input
                                type="email"

                                value={
                                    email
                                }

                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }

                                placeholder="name@resqnet.dev"

                                autoComplete="email"

                                required
                            />

                        </div>


                        <div className="login-field">

                            <label>
                                Password
                            </label>


                            <input
                                type="password"

                                value={
                                    password
                                }

                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }

                                placeholder="Enter password"

                                autoComplete="current-password"

                                required
                            />

                        </div>


                        <button
                            type="submit"

                            className="login-button"

                            disabled={
                                submitting
                            }
                        >

                            {
                                submitting
                                    ? "Authenticating..."
                                    : "Access Command Network →"
                            }

                        </button>


                        <div className="login-security">

                            🔐 Protected authentication
                            channel

                        </div>


                    </form>

                </div>


            </div>

        </div>

    );

}


export default Login;