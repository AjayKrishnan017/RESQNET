import {
    Navigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";


function ProtectedRoute({
    children,
    allowedRoles = []
}) {

    const {
        user,
        loading,
        isAuthenticated
    } =
        useAuth();


    // ========================================
    // LOADING SESSION
    // ========================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight:
                        "100vh",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    background:
                        "#111318",

                    color:
                        "#94a3b8",

                    fontFamily:
                        "Inter, sans-serif"
                }}
            >

                Connecting to RESQNET...

            </div>

        );

    }


    // ========================================
    // NOT LOGGED IN
    // ========================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ========================================
    // ROLE CHECK
    // ========================================

    if (
        allowedRoles.length >
            0 &&

        !allowedRoles.includes(
            user?.role
        )
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return children;
}


export default ProtectedRoute;