import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


import "../css/commandCenter.css";


import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import CommandMap from "../components/CommandMap.jsx";
import LiveStatus from "../components/LiveStatus.jsx";


import socket from "../services/socketService.js";


import {
    getIncidents
} from "../services/incidentService.js";


import {
    getResponders
} from "../services/responderService.js";


import {
    getShelters
} from "../services/shelterService.js";


import {
    getResources
} from "../services/resourceService.js";


function CommandCenter() {

    const navigate =
        useNavigate();


    // ========================================
    // DATA
    // ========================================

    const [
        incidents,
        setIncidents
    ] = useState([]);


    const [
        responders,
        setResponders
    ] = useState([]);


    const [
        shelters,
        setShelters
    ] = useState([]);


    const [
        resources,
        setResources
    ] = useState([]);


    // ========================================
    // PAGE STATE
    // ========================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        lastUpdated,
        setLastUpdated
    ] = useState(null);


    const [
        realtimeMessage,
        setRealtimeMessage
    ] = useState("");


    // ========================================
    // LOAD ALL COMMAND DATA
    // ========================================

    const loadCommandData =
        async (
            silent = false
        ) => {

            try {

                if (!silent) {

                    setLoading(true);

                }


                setError("");


                const [
                    incidentData,
                    responderData,
                    shelterData,
                    resourceData
                ] =
                    await Promise.all([

                        getIncidents(),

                        getResponders(),

                        getShelters(),

                        getResources()

                    ]);


                // ========================================
                // INCIDENTS
                // ========================================

                setIncidents(

                    Array.isArray(
                        incidentData
                            ?.incidents
                    )

                        ? incidentData.incidents

                        : Array.isArray(
                            incidentData
                        )

                            ? incidentData

                            : []

                );


                // ========================================
                // RESPONDERS
                // ========================================

                setResponders(

                    Array.isArray(
                        responderData
                            ?.responders
                    )

                        ? responderData.responders

                        : Array.isArray(
                            responderData
                        )

                            ? responderData

                            : []

                );


                // ========================================
                // SHELTERS
                // ========================================

                setShelters(

                    Array.isArray(
                        shelterData
                            ?.shelters
                    )

                        ? shelterData.shelters

                        : Array.isArray(
                            shelterData
                        )

                            ? shelterData

                            : []

                );


                // ========================================
                // RESOURCES
                // ========================================

                setResources(

                    Array.isArray(
                        resourceData
                            ?.resources
                    )

                        ? resourceData.resources

                        : Array.isArray(
                            resourceData
                        )

                            ? resourceData

                            : []

                );


                setLastUpdated(
                    new Date()
                );


            } catch (error) {

                console.error(
                    "Command center error:",
                    error
                );


                setError(
                    "Failed to load command center data."
                );


            } finally {

                if (!silent) {

                    setLoading(false);

                }

            }

        };


    // ========================================
    // INITIAL LOAD + SOCKET.IO
    // ========================================

    useEffect(() => {

        loadCommandData();


        // ========================================
        // SOCKET CONNECTION READY
        // ========================================

        const handleConnectionReady =
            (data) => {

                console.log(
                    "📡 RESQNET:",
                    data
                );

            };


        // ========================================
        // REAL-TIME SYSTEM UPDATE
        // ========================================

        const handleRealtimeUpdate =
            async (event) => {

                console.log(
                    "📡 RESQNET LIVE UPDATE:",
                    event
                );


                // Small readable status message

                let message =
                    "Operational data updated";


                if (
                    event?.path
                        ?.includes(
                            "/incidents"
                        )
                ) {

                    message =
                        "🚨 Incident network updated";

                }


                else if (
                    event?.path
                        ?.includes(
                            "/assignments"
                        )
                ) {

                    message =
                        "👨‍🚒 Deployment network updated";

                }


                else if (
                    event?.path
                        ?.includes(
                            "/responders"
                        )
                ) {

                    message =
                        "👨‍🚒 Responder network updated";

                }


                else if (
                    event?.path
                        ?.includes(
                            "/shelters"
                        )
                ) {

                    message =
                        "🏥 Shelter network updated";

                }


                else if (
                    event?.path
                        ?.includes(
                            "/resources"
                        )
                ) {

                    message =
                        "📦 Resource network updated";

                }


                setRealtimeMessage(
                    message
                );


                // Silent refresh:
                // page does not show full loading screen

                await loadCommandData(
                    true
                );


                // Remove message after 3 seconds

                setTimeout(
                    () => {

                        setRealtimeMessage(
                            ""
                        );

                    },
                    3000
                );

            };


        socket.on(
            "connection:ready",
            handleConnectionReady
        );


        socket.on(
            "system:update",
            handleRealtimeUpdate
        );


        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            socket.off(
                "connection:ready",
                handleConnectionReady
            );


            socket.off(
                "system:update",
                handleRealtimeUpdate
            );

        };

    }, []);


    // ========================================
    // ACTIVE INCIDENTS
    // ========================================

    const activeIncidents =
        incidents.filter(
            (incident) =>

                incident.status !==
                "RESOLVED"
        );


    // ========================================
    // CRITICAL INCIDENTS
    // ========================================

    const criticalIncidents =
        incidents.filter(
            (incident) =>

                incident.severity ===
                    "CRITICAL" &&

                incident.status !==
                    "RESOLVED"
        );


    // ========================================
    // AVAILABLE RESPONDERS
    // ========================================

    const availableResponders =
        responders.filter(
            (responder) =>

                responder.status ===
                "AVAILABLE"
        );


    // ========================================
    // DEPLOYED RESPONDERS
    // ========================================

    const deployedResponders =
        responders.filter(
            (responder) =>

                responder.status ===
                "DEPLOYED"
        );


    // ========================================
    // TOTAL PEOPLE AFFECTED
    // ========================================

    const totalPeopleAffected =
        activeIncidents.reduce(
            (
                total,
                incident
            ) =>

                total +
                (
                    Number(
                        incident.peopleAffected
                    ) || 0
                ),

            0
        );


    // ========================================
    // SHELTER CAPACITY
    // ========================================

    const totalShelterCapacity =
        shelters.reduce(
            (
                total,
                shelter
            ) =>

                total +
                (
                    Number(
                        shelter.capacity
                    ) || 0
                ),

            0
        );


    const occupiedShelterCapacity =
        shelters.reduce(
            (
                total,
                shelter
            ) =>

                total +
                (
                    Number(
                        shelter.occupied
                    ) || 0
                ),

            0
        );


    const availableShelterSpace =
        Math.max(
            0,

            totalShelterCapacity -
            occupiedShelterCapacity
        );


    // ========================================
    // RESOURCE ALERTS
    // ========================================

    const lowStockResources =
        resources.filter(
            (resource) =>

                resource.status ===
                    "LOW_STOCK" ||

                resource.status ===
                    "OUT_OF_STOCK"
        );


    // ========================================
    // PRIORITY SORTING
    // ========================================

    const severityRank = {

        CRITICAL: 4,

        HIGH: 3,

        MEDIUM: 2,

        LOW: 1

    };


    const priorityIncidents =
        [...activeIncidents]
            .sort(
                (a, b) => {

                    const severityDifference =

                        (
                            severityRank[
                                b.severity
                            ] || 0
                        ) -

                        (
                            severityRank[
                                a.severity
                            ] || 0
                        );


                    if (
                        severityDifference !==
                        0
                    ) {

                        return severityDifference;

                    }


                    return (

                        (
                            Number(
                                b.peopleAffected
                            ) || 0
                        ) -

                        (
                            Number(
                                a.peopleAffected
                            ) || 0
                        )

                    );

                }
            )
            .slice(
                0,
                5
            );


    // ========================================
    // ALERT ENGINE
    // ========================================

    const alerts = [];


    // CRITICAL INCIDENT ALERTS

    criticalIncidents.forEach(
        (incident) => {

            alerts.push({

                type:
                    "critical",

                message:
                    `Critical ${incident.disasterType
                        ?.replaceAll(
                            "_",
                            " "
                        )
                        .toLowerCase()} — ${incident.title}`

            });

        }
    );


    // SHELTER ALERTS

    shelters.forEach(
        (shelter) => {

            const capacity =
                Number(
                    shelter.capacity
                ) || 0;


            const occupied =
                Number(
                    shelter.occupied
                ) || 0;


            if (
                capacity <= 0
            ) {

                return;

            }


            const percentage =

                (
                    occupied /
                    capacity
                ) *
                100;


            if (
                percentage >= 90
            ) {

                alerts.push({

                    type:
                        "warning",

                    message:
                        `${shelter.name} shelter is ${Math.round(
                            percentage
                        )}% occupied`

                });

            }

        }
    );


    // RESOURCE ALERTS

    lowStockResources.forEach(
        (resource) => {

            alerts.push({

                type:
                    "resource",

                message:
                    `${resource.name} is ${
                        resource.status
                            ?.replaceAll(
                                "_",
                                " "
                            )
                            .toLowerCase()
                    }`

            });

        }
    );


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    {/* ========================================
                        HEADER
                    ======================================== */}

                    <div className="command-header">


                        <div>

                            <h1>
                                🛰️ RESQNET Command Center
                            </h1>


                            <p>

                                Unified real-time emergency
                                operations and response monitoring.

                            </p>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap:
                                    "10px",

                                flexWrap:
                                    "wrap"
                            }}
                        >

                            <LiveStatus />


                            <button
                                type="button"

                                className="command-refresh-button"

                                onClick={() =>
                                    loadCommandData()
                                }

                                disabled={
                                    loading
                                }
                            >

                                ↻ Refresh

                            </button>

                        </div>

                    </div>


                    {/* ========================================
                        LIVE UPDATE MESSAGE
                    ======================================== */}

                    {
                        realtimeMessage && (

                            <div
                                style={{
                                    marginBottom:
                                        "15px",

                                    padding:
                                        "10px 13px",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "rgba(34, 197, 94, 0.10)",

                                    border:
                                        "1px solid rgba(34, 197, 94, 0.25)",

                                    color:
                                        "#86efac",

                                    fontSize:
                                        "12px"
                                }}
                            >

                                📡{" "}
                                {
                                    realtimeMessage
                                }

                            </div>

                        )
                    }


                    {/* ========================================
                        LAST UPDATED
                    ======================================== */}

                    {
                        lastUpdated && (

                            <div
                                style={{
                                    marginBottom:
                                        "14px",

                                    color:
                                        "#64748b",

                                    fontSize:
                                        "10px"
                                }}
                            >

                                Last synchronized:{" "}

                                {
                                    lastUpdated
                                        .toLocaleTimeString()
                                }

                            </div>

                        )
                    }


                    {/* ========================================
                        ERROR
                    ======================================== */}

                    {error && (

                        <div className="command-error">

                            {error}

                        </div>

                    )}


                    {/* ========================================
                        LOADING
                    ======================================== */}

                    {
                        loading ? (

                            <div className="command-empty">

                                Connecting to RESQNET
                                operational network...

                            </div>

                        ) : (

                            <>


                                {/* ========================================
                                    PRIMARY STATISTICS
                                ======================================== */}

                                <div className="command-stat-grid">


                                    <div className="command-stat-card">

                                        <span className="command-stat-icon">
                                            🚨
                                        </span>


                                        <div>

                                            <p>
                                                Active Incidents
                                            </p>


                                            <h2>

                                                {
                                                    activeIncidents
                                                        .length
                                                }

                                            </h2>

                                        </div>

                                    </div>


                                    <div className="command-stat-card">

                                        <span className="command-stat-icon">
                                            🔴
                                        </span>


                                        <div>

                                            <p>
                                                Critical
                                            </p>


                                            <h2>

                                                {
                                                    criticalIncidents
                                                        .length
                                                }

                                            </h2>

                                        </div>

                                    </div>


                                    <div className="command-stat-card">

                                        <span className="command-stat-icon">
                                            👨‍🚒
                                        </span>


                                        <div>

                                            <p>
                                                Available Teams
                                            </p>


                                            <h2>

                                                {
                                                    availableResponders
                                                        .length
                                                }

                                            </h2>

                                        </div>

                                    </div>


                                    <div className="command-stat-card">

                                        <span className="command-stat-icon">
                                            🏥
                                        </span>


                                        <div>

                                            <p>
                                                Shelter Space
                                            </p>


                                            <h2>

                                                {
                                                    availableShelterSpace
                                                }

                                            </h2>

                                        </div>

                                    </div>

                                </div>


                                {/* ========================================
                                    SECONDARY STATUS
                                ======================================== */}

                                <div className="command-secondary-grid">


                                    <div>

                                        <span>
                                            👨‍🚒 Deployed
                                        </span>


                                        <strong>

                                            {
                                                deployedResponders
                                                    .length
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            👥 People Affected
                                        </span>


                                        <strong>

                                            {
                                                totalPeopleAffected
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            🏥 Shelters
                                        </span>


                                        <strong>

                                            {
                                                shelters.length
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            📦 Supply Alerts
                                        </span>


                                        <strong>

                                            {
                                                lowStockResources
                                                    .length
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* ========================================
                                    OPERATIONAL ALERTS
                                ======================================== */}

                                <section className="command-section">


                                    <div className="command-section-header">


                                        <div>

                                            <h2>
                                                ⚠️ Operational Alerts
                                            </h2>


                                            <p>
                                                Conditions requiring
                                                dispatcher attention.
                                            </p>

                                        </div>


                                        <span>

                                            {
                                                alerts.length
                                            }{" "}

                                            alerts

                                        </span>

                                    </div>


                                    {
                                        alerts.length ===
                                        0 ? (

                                            <div className="command-empty">

                                                ✅ No major operational
                                                alerts.

                                            </div>

                                        ) : (

                                            <div className="command-alert-list">


                                                {
                                                    alerts
                                                        .slice(
                                                            0,
                                                            8
                                                        )
                                                        .map(
                                                            (
                                                                alert,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className={`command-alert ${alert.type}`}

                                                                    key={
                                                                        `${alert.type}-${index}`
                                                                    }
                                                                >

                                                                    <span>

                                                                        {
                                                                            alert.type ===
                                                                            "critical"

                                                                                ? "🚨"

                                                                                : alert.type ===
                                                                                    "resource"

                                                                                    ? "📦"

                                                                                    : "⚠️"
                                                                        }

                                                                    </span>


                                                                    <p>

                                                                        {
                                                                            alert.message
                                                                        }

                                                                    </p>

                                                                </div>

                                                            )
                                                        )
                                                }

                                            </div>

                                        )
                                    }

                                </section>


                                {/* ========================================
                                    LIVE OPERATIONS MAP
                                ======================================== */}

                                <section className="command-section">


                                    <div className="command-section-header">


                                        <div>

                                            <h2>
                                                🗺️ Live Operations Map
                                            </h2>


                                            <p>
                                                Live incidents,
                                                responder teams and
                                                emergency shelters.
                                            </p>

                                        </div>


                                        <LiveStatus />

                                    </div>


                                    <CommandMap

                                        incidents={
                                            incidents
                                        }

                                        responders={
                                            responders
                                        }

                                        shelters={
                                            shelters
                                        }

                                    />

                                </section>


                                {/* ========================================
                                    PRIORITY INCIDENTS
                                ======================================== */}

                                <section className="command-section">


                                    <div className="command-section-header">


                                        <div>

                                            <h2>
                                                🚨 Priority Incidents
                                            </h2>


                                            <p>
                                                Highest-priority active
                                                emergencies.
                                            </p>

                                        </div>

                                    </div>


                                    {
                                        priorityIncidents
                                            .length ===
                                        0 ? (

                                            <div className="command-empty">

                                                No active incidents.

                                            </div>

                                        ) : (

                                            <div className="priority-incident-list">


                                                {
                                                    priorityIncidents
                                                        .map(
                                                            (
                                                                incident,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="priority-incident"

                                                                    key={
                                                                        incident._id
                                                                    }
                                                                >


                                                                    <div className="priority-rank">

                                                                        #
                                                                        {
                                                                            index +
                                                                            1
                                                                        }

                                                                    </div>


                                                                    <div className="priority-info">

                                                                        <h3>

                                                                            {
                                                                                incident.title
                                                                            }

                                                                        </h3>


                                                                        <p>

                                                                            {
                                                                                incident.disasterType
                                                                                    ?.replaceAll(
                                                                                        "_",
                                                                                        " "
                                                                                    )
                                                                            }

                                                                            {" • "}

                                                                            {
                                                                                incident.peopleAffected ??
                                                                                0
                                                                            }

                                                                            {" people affected"}

                                                                        </p>

                                                                    </div>


                                                                    <span
                                                                        className={`command-severity ${
                                                                            incident.severity
                                                                                ?.toLowerCase()
                                                                        }`}
                                                                    >

                                                                        {
                                                                            incident.severity
                                                                        }

                                                                    </span>


                                                                    <button
                                                                        type="button"

                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/incidents/${incident._id}`
                                                                            )
                                                                        }
                                                                    >

                                                                        Open Command →

                                                                    </button>

                                                                </div>

                                                            )
                                                        )
                                                }

                                            </div>

                                        )
                                    }

                                </section>

                            </>

                        )
                    }


                </main>

            </div>

        </div>

    );

}


export default CommandCenter;