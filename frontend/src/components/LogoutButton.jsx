import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";


function LogoutButton() {

    const navigate =
        useNavigate();


    const {
        logout
    } =
        useAuth();


    const handleLogout =
        () => {

            logout();


            navigate(
                "/login",
                {
                    replace: true
                }
            );

        };


    return (

        <button
            type="button"

            onClick={
                handleLogout
            }

            style={{
                width:
                    "100%",

                padding:
                    "9px 10px",

                border:
                    "1px solid #3b404a",

                borderRadius:
                    "7px",

                background:
                    "#1b1e25",

                color:
                    "#cbd5e1",

                cursor:
                    "pointer",

                fontSize:
                    "11px"
            }}
        >

            🚪 Logout

        </button>

    );

}


export default LogoutButton;