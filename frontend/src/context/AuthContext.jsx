import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    loginUser,
    getCurrentUser
} from "../services/authService.js";


const AuthContext =
    createContext(null);


export function AuthProvider({
    children
}) {

    const [
        user,
        setUser
    ] = useState(null);


    const [
        token,
        setToken
    ] = useState(
        localStorage.getItem(
            "resqnet_token"
        )
    );


    const [
        loading,
        setLoading
    ] = useState(true);


    // ========================================
    // APPLY TOKEN TO AXIOS
    // ========================================

    const applyToken =
        (jwtToken) => {

            if (jwtToken) {

                axios.defaults.headers.common[
                    "Authorization"
                ] =
                    `Bearer ${jwtToken}`;

            } else {

                delete axios.defaults
                    .headers
                    .common[
                        "Authorization"
                    ];

            }

        };


    // ========================================
    // RESTORE LOGIN ON PAGE REFRESH
    // ========================================

    useEffect(() => {

        const restoreSession =
            async () => {

                const savedToken =
                    localStorage.getItem(
                        "resqnet_token"
                    );


                if (!savedToken) {

                    setLoading(false);

                    return;

                }


                try {

                    applyToken(
                        savedToken
                    );


                    const data =
                        await getCurrentUser();


                    setUser(
                        data?.user ||
                        null
                    );


                    setToken(
                        savedToken
                    );


                } catch (error) {

                    console.error(
                        "Session restore failed:",
                        error
                    );


                    localStorage.removeItem(
                        "resqnet_token"
                    );


                    localStorage.removeItem(
                        "resqnet_user"
                    );


                    applyToken(
                        null
                    );


                    setUser(
                        null
                    );


                    setToken(
                        null
                    );


                } finally {

                    setLoading(false);

                }

            };


        restoreSession();

    }, []);


    // ========================================
    // LOGIN
    // ========================================

    const login =
        async (
            email,
            password
        ) => {

            const data =
                await loginUser(
                    email,
                    password
                );


            if (
                !data?.success ||
                !data?.token
            ) {

                throw new Error(
                    data?.message ||
                    "Login failed."
                );

            }


            localStorage.setItem(
                "resqnet_token",
                data.token
            );


            localStorage.setItem(
                "resqnet_user",
                JSON.stringify(
                    data.user
                )
            );


            applyToken(
                data.token
            );


            setToken(
                data.token
            );


            setUser(
                data.user
            );


            return data.user;

        };


    // ========================================
    // LOGOUT
    // ========================================

    const logout =
        () => {

            localStorage.removeItem(
                "resqnet_token"
            );


            localStorage.removeItem(
                "resqnet_user"
            );


            applyToken(
                null
            );


            setToken(
                null
            );


            setUser(
                null
            );

        };


    // ========================================
    // ROLE CHECK
    // ========================================

    const hasRole =
        (...roles) => {

            if (!user) {

                return false;

            }


            return roles.includes(
                user.role
            );

        };


    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                hasRole,
                isAuthenticated:
                    Boolean(
                        user &&
                        token
                    )
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }


    return context;
}