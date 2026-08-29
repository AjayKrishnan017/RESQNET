import {
    Link,
    useLocation
} from "react-router-dom";

import "../css/sidebar.css";

import {
    useAuth
} from "../context/AuthContext.jsx";

import LogoutButton from "./LogoutButton.jsx";


function Sidebar() {

    const location =
        useLocation();


    const {
        user
    } = useAuth();


    // ========================================
    // ROLE CHECK
    // ========================================

    const hasRole =
        (...roles) => {

            return roles.includes(
                user?.role
            );

        };


    // ========================================
    // ACTIVE LINK HELPER
    // ========================================

    const isActive =
        (path) => {

            if (
                path === "/"
            ) {

                return location.pathname === "/";

            }


            return location.pathname.startsWith(
                path
            );

        };


    // ========================================
    // USER ICON
    // ========================================

    const getUserIcon =
        () => {

            switch (
                user?.role
            ) {

                case "ADMIN":
                    return "🛡️";

                case "DISPATCHER":
                    return "🎧";

                case "RESPONDER":
                    return "👨‍🚒";

                case "SHELTER_MANAGER":
                    return "🏥";

                default:
                    return "👤";

            }

        };


    return (

        <aside className="sidebar">


            {/* ========================================
                BRAND
            ======================================== */}

            <div className="sidebar-title">

                RESQNET

            </div>


            {/* ========================================
                NAVIGATION
            ======================================== */}

            <ul className="sidebar-menu">


                {/* ========================================
                    DASHBOARD
                    ALL AUTHENTICATED USERS
                ======================================== */}

                <li>

                    <Link
                        to="/"

                        className={
                            isActive("/")
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >

                        <span>
                            🏠
                        </span>


                        <span>
                            Dashboard
                        </span>

                    </Link>

                </li>


                {/* ========================================
                    COMMAND CENTER
                    ADMIN + DISPATCHER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER"
                    ) && (

                        <li>

                            <Link
                                to="/command-center"

                                className={
                                    isActive(
                                        "/command-center"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    🛰️
                                </span>


                                <span>
                                    Command Center
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    INCIDENT MANAGEMENT
                    ADMIN + DISPATCHER + RESPONDER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER",
                        "RESPONDER"
                    ) && (

                        <li>

                            <Link
                                to="/incidents"

                                className={
                                    isActive(
                                        "/incidents"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    🚨
                                </span>


                                <span>
                                    Incident Management
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    RESPONDERS
                    ADMIN + DISPATCHER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER"
                    ) && (

                        <li>

                            <Link
                                to="/responders"

                                className={
                                    isActive(
                                        "/responders"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    👨‍🚒
                                </span>


                                <span>
                                    Responders
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    SHELTERS
                    ADMIN + DISPATCHER + SHELTER_MANAGER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER",
                        "SHELTER_MANAGER"
                    ) && (

                        <li>

                            <Link
                                to="/shelters"

                                className={
                                    isActive(
                                        "/shelters"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    🏥
                                </span>


                                <span>
                                    Shelters
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    RESOURCES
                    ADMIN + DISPATCHER + SHELTER_MANAGER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER",
                        "SHELTER_MANAGER"
                    ) && (

                        <li>

                            <Link
                                to="/resources"

                                className={
                                    isActive(
                                        "/resources"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    📦
                                </span>


                                <span>
                                    Resources
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    USER MANAGEMENT
                    ADMIN ONLY
                ======================================== */}

                {
                    hasRole(
                        "ADMIN"
                    ) && (

                        <li>

                            <Link
                                to="/users"

                                className={
                                    isActive(
                                        "/users"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    👥
                                </span>


                                <span>
                                    User Management
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    AUDIT LOG
                    ADMIN ONLY
                ======================================== */}

                {
                    hasRole(
                        "ADMIN"
                    ) && (

                        <li>

                            <Link
                                to="/audit-logs"

                                className={
                                    isActive(
                                        "/audit-logs"
                                    )
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    📋
                                </span>


                                <span>
                                    Audit Log
                                </span>

                            </Link>

                        </li>

                    )
                }


                {/* ========================================
                    REPORT INCIDENT
                    ADMIN + DISPATCHER
                ======================================== */}

                {
                    hasRole(
                        "ADMIN",
                        "DISPATCHER"
                    ) && (

                        <li>

                            <Link
                                to="/create-incident"

                                className={
                                    location.pathname ===
                                    "/create-incident"
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <span>
                                    ➕
                                </span>


                                <span>
                                    Report Incident
                                </span>

                            </Link>

                        </li>

                    )
                }


            </ul>


            {/* ========================================
                USER ACCOUNT AREA
            ======================================== */}

            <div
                style={{
                    marginTop:
                        "auto",

                    padding:
                        "15px"
                }}
            >


                <div
                    style={{
                        padding:
                            "12px",

                        marginBottom:
                            "10px",

                        borderRadius:
                            "9px",

                        background:
                            "#1a1d24",

                        border:
                            "1px solid #292d36"
                    }}
                >


                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "10px"
                        }}
                    >


                        {/* ========================================
                            AVATAR
                        ======================================== */}

                        <div
                            style={{
                                width:
                                    "36px",

                                height:
                                    "36px",

                                minWidth:
                                    "36px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                borderRadius:
                                    "8px",

                                background:
                                    "#272b35",

                                fontSize:
                                    "17px"
                            }}
                        >

                            {
                                getUserIcon()
                            }

                        </div>


                        {/* ========================================
                            NAME + ROLE
                        ======================================== */}

                        <div
                            style={{
                                flex:
                                    1,

                                minWidth:
                                    0
                            }}
                        >


                            <strong
                                style={{
                                    display:
                                        "block",

                                    color:
                                        "#f8fafc",

                                    fontSize:
                                        "11px",

                                    whiteSpace:
                                        "nowrap",

                                    overflow:
                                        "hidden",

                                    textOverflow:
                                        "ellipsis"
                                }}
                            >

                                {
                                    user?.name ||
                                    "RESQNET User"
                                }

                            </strong>


                            <span
                                style={{
                                    display:
                                        "block",

                                    marginTop:
                                        "3px",

                                    color:
                                        "#94a3b8",

                                    fontSize:
                                        "9px",

                                    fontWeight:
                                        "700",

                                    letterSpacing:
                                        "0.4px"
                                }}
                            >

                                {
                                    user?.role
                                        ?.replaceAll(
                                            "_",
                                            " "
                                        ) ||
                                    "USER"
                                }

                            </span>


                        </div>


                    </div>


                    {/* ========================================
                        EMAIL
                    ======================================== */}

                    {
                        user?.email && (

                            <div
                                style={{
                                    marginTop:
                                        "10px",

                                    paddingTop:
                                        "9px",

                                    borderTop:
                                        "1px solid #292d36",

                                    color:
                                        "#64748b",

                                    fontSize:
                                        "9px",

                                    overflow:
                                        "hidden",

                                    textOverflow:
                                        "ellipsis",

                                    whiteSpace:
                                        "nowrap"
                                }}
                            >

                                {
                                    user.email
                                }

                            </div>

                        )
                    }


                </div>


                {/* ========================================
                    LOGOUT
                ======================================== */}

                <LogoutButton />


            </div>


        </aside>

    );

}


export default Sidebar;