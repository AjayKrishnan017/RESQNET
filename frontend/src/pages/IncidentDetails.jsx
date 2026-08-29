import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import "../css/incidentDetails.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import SmartDispatch from "../components/SmartDispatch.jsx";
import AIDecisionPanel from "../components/AIDecisionPanel.jsx";
import GeoIntelligence from "../components/GeoIntelligence.jsx";
import ResponderAssignment from "../components/ResponderAssignment.jsx";

import socket from "../services/socketService.js";

import {
    useAuth
} from "../context/AuthContext.jsx";

import {
    getIncidentById,
    deleteIncident
} from "../services/incidentService.js";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function IncidentDetails() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const {
        user
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [
        incident,
        setIncident
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // Used by:
    // Smart Dispatch
    // Decision Intelligence
    // Geo Intelligence
    // Responder Assignment

    const [
        deploymentRefreshKey,
        setDeploymentRefreshKey
    ] = useState(0);


    // ========================================
    // ROLE PERMISSIONS
    // ========================================

    const canOperate =
        user?.role === "ADMIN" ||
        user?.role === "DISPATCHER";


    const canEdit =
        user?.role === "ADMIN" ||
        user?.role === "DISPATCHER";


    const canDelete =
        user?.role === "ADMIN";


    // ========================================
    // LOAD INCIDENT
    // ========================================

    const loadIncident =
        useCallback(
            async (
                silent = false
            ) => {

                try {

                    if (!silent) {

                        setLoading(true);

                    }


                    setError("");


                    const data =
                        await getIncidentById(
                            id
                        );


                    const incidentData =
                        data?.incident ||
                        data;


                    if (
                        !incidentData ||
                        typeof incidentData !==
                            "object"
                    ) {

                        setIncident(
                            null
                        );


                        setError(
                            "Incident not found."
                        );


                        return;

                    }


                    setIncident(
                        incidentData
                    );


                } catch (error) {

                    console.error(
                        "Failed to load incident:",
                        error
                    );


                    setError(

                        error.response
                            ?.data
                            ?.message ||

                        "Failed to load incident."

                    );


                } finally {

                    if (!silent) {

                        setLoading(false);

                    }

                }

            },
            [id]
        );


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        loadIncident();

    }, [
        loadIncident
    ]);


    // ========================================
    // REAL-TIME SOCKET.IO UPDATES
    // ========================================

    useEffect(() => {

        const handleRealtimeUpdate =
            async (event) => {

                console.log(
                    "📡 Incident command live update:",
                    event
                );


                // Refresh intelligence systems

                setDeploymentRefreshKey(
                    (previous) =>
                        previous + 1
                );


                // If incident information itself changed,
                // silently reload the incident.

                if (
                    event?.path
                        ?.includes(
                            "/api/incidents"
                        )
                ) {

                    await loadIncident(
                        true
                    );

                }

            };


        socket.on(
            "system:update",
            handleRealtimeUpdate
        );


        return () => {

            socket.off(
                "system:update",
                handleRealtimeUpdate
            );

        };

    }, [
        loadIncident
    ]);


    // ========================================
    // DEPLOYMENT CHANGE
    // ========================================

    const handleDeploymentChange =
        () => {

            setDeploymentRefreshKey(
                (previous) =>
                    previous + 1
            );

        };


    // ========================================
    // DELETE INCIDENT
    // ========================================

    const handleDelete =
        async () => {

            if (!canDelete) {

                window.alert(
                    "Only administrators can delete incidents."
                );

                return;

            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this incident?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteIncident(
                    id
                );


                navigate(
                    "/incidents"
                );


            } catch (error) {

                console.error(
                    "Failed to delete incident:",
                    error
                );


                window.alert(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to delete incident."

                );

            }

        };


    // ========================================
    // EDIT INCIDENT
    // ========================================

    const handleEdit =
        () => {

            if (!canEdit) {

                return;

            }


            navigate(
                `/incidents/${id}/edit`
            );

        };


    // ========================================
    // LOADING PAGE
    // ========================================

    if (loading) {

        return (

            <div className="dashboard">

                <Navbar />


                <div className="dashboard-layout">

                    <Sidebar />


                    <main className="main-content">

                        <div className="incident-details-loading">

                            Loading incident command data...

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ========================================
    // ERROR PAGE
    // ========================================

    if (error) {

        return (

            <div className="dashboard">

                <Navbar />


                <div className="dashboard-layout">

                    <Sidebar />


                    <main className="main-content">

                        <div className="incident-details-error">

                            <h2>
                                Unable to load incident
                            </h2>


                            <p>
                                {error}
                            </p>


                            <button
                                className="back-button"

                                onClick={() =>
                                    navigate(
                                        "/incidents"
                                    )
                                }
                            >

                                ← Back to Incidents

                            </button>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ========================================
    // NOT FOUND
    // ========================================

    if (!incident) {

        return (

            <div className="dashboard">

                <Navbar />


                <div className="dashboard-layout">

                    <Sidebar />


                    <main className="main-content">

                        <div className="incident-details-error">

                            <h2>
                                Incident not found
                            </h2>


                            <button
                                className="back-button"

                                onClick={() =>
                                    navigate(
                                        "/incidents"
                                    )
                                }
                            >

                                ← Back to Incidents

                            </button>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ========================================
    // SAFE VALUES
    // ========================================

    const latitude =
        Number(
            incident.location
                ?.latitude
        );


    const longitude =
        Number(
            incident.location
                ?.longitude
        );


    const hasValidLocation =
        Number.isFinite(
            latitude
        ) &&
        Number.isFinite(
            longitude
        );


    const severity =
        String(
            incident.severity ||
            "UNKNOWN"
        );


    const status =
        String(
            incident.status ||
            "UNKNOWN"
        );


    const disasterType =
        String(
            incident.disasterType ||
            "UNKNOWN"
        );


    const formattedStatus =
        status.replaceAll(
            "_",
            " "
        );


    const formattedDisasterType =
        disasterType.replaceAll(
            "_",
            " "
        );


    // ========================================
    // MAIN PAGE
    // ========================================

    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    <div className="incident-details-page">


                        {/* ========================================
                            BACK
                        ======================================== */}

                        <button
                            className="back-button"

                            onClick={() =>
                                navigate(
                                    "/incidents"
                                )
                            }
                        >

                            ← Back to Incidents

                        </button>


                        {/* ========================================
                            INCIDENT HEADER
                        ======================================== */}

                        <div className="incident-details-header">


                            <div>

                                <h1>

                                    {
                                        incident.title ||
                                        "Untitled Incident"
                                    }

                                </h1>


                                <p>

                                    Incident ID:{" "}

                                    {
                                        incident._id ||
                                        "Unknown"
                                    }

                                </p>

                            </div>


                            <div className="incident-details-badges">


                                <span
                                    className={`severity-badge ${severity.toLowerCase()}`}
                                >

                                    {
                                        severity
                                    }

                                </span>


                                <span
                                    className={`status-badge ${status.toLowerCase()}`}
                                >

                                    {
                                        formattedStatus
                                    }

                                </span>


                            </div>

                        </div>


                        {/* ========================================
                            DESCRIPTION
                        ======================================== */}

                        <div className="incident-details-card">

                            <h2>
                                Incident Description
                            </h2>


                            <div className="incident-description-box">

                                <p>

                                    {
                                        incident.description ||
                                        "No description available."
                                    }

                                </p>

                            </div>

                        </div>


                        {/* ========================================
                            INFORMATION GRID
                        ======================================== */}

                        <div className="incident-details-grid">


                            {/* DISASTER INFORMATION */}

                            <div className="incident-details-card">

                                <h3>
                                    🚨 Disaster Information
                                </h3>


                                <div className="detail-row">

                                    <span className="detail-label">
                                        Disaster Type
                                    </span>


                                    <span className="detail-value">

                                        {
                                            formattedDisasterType
                                        }

                                    </span>

                                </div>


                                <div className="detail-row">

                                    <span className="detail-label">
                                        Severity
                                    </span>


                                    <span className="detail-value">

                                        {
                                            severity
                                        }

                                    </span>

                                </div>


                            </div>


                            {/* RESPONSE INFORMATION */}

                            <div className="incident-details-card">

                                <h3>
                                    📊 Response Status
                                </h3>


                                <div className="detail-row">

                                    <span className="detail-label">
                                        Current Status
                                    </span>


                                    <span className="detail-value">

                                        {
                                            formattedStatus
                                        }

                                    </span>

                                </div>


                                <div className="detail-row">

                                    <span className="detail-label">
                                        People Affected
                                    </span>


                                    <span className="detail-value">

                                        {
                                            incident.peopleAffected ??
                                            0
                                        }

                                    </span>

                                </div>


                            </div>


                        </div>


                        {/* ========================================
                            COMMAND INTELLIGENCE
                            ADMIN + DISPATCHER ONLY
                        ======================================== */}

                        {
                            canOperate && (

                                <>


                                    {/* ========================================
                                        SMART DISPATCH
                                    ======================================== */}

                                    <SmartDispatch

                                        incidentId={
                                            incident._id
                                        }

                                        refreshKey={
                                            deploymentRefreshKey
                                        }

                                        onDeploymentChange={
                                            handleDeploymentChange
                                        }

                                    />


                                    {/* ========================================
                                        DECISION INTELLIGENCE
                                    ======================================== */}

                                    <AIDecisionPanel

                                        incidentId={
                                            incident._id
                                        }

                                        refreshKey={
                                            deploymentRefreshKey
                                        }

                                    />


                                    {/* ========================================
                                        GEOSPATIAL INTELLIGENCE
                                    ======================================== */}

                                    <GeoIntelligence

                                        incidentId={
                                            incident._id
                                        }

                                        refreshKey={
                                            deploymentRefreshKey
                                        }

                                    />


                                    {/* ========================================
                                        RESPONDER ASSIGNMENT
                                    ======================================== */}

                                    <ResponderAssignment

                                        incidentId={
                                            incident._id
                                        }

                                        refreshKey={
                                            deploymentRefreshKey
                                        }

                                        onDeploymentChange={
                                            handleDeploymentChange
                                        }

                                    />


                                </>

                            )
                        }


                        {/* ========================================
                            LOCATION INFORMATION
                        ======================================== */}

                        <div className="incident-details-card">

                            <h2>
                                📍 Incident Location
                            </h2>


                            <div className="location-coordinates">


                                <div className="coordinate-box">

                                    <span>
                                        Latitude
                                    </span>


                                    <strong>

                                        {
                                            hasValidLocation
                                                ? latitude
                                                : "Unknown"
                                        }

                                    </strong>

                                </div>


                                <div className="coordinate-box">

                                    <span>
                                        Longitude
                                    </span>


                                    <strong>

                                        {
                                            hasValidLocation
                                                ? longitude
                                                : "Unknown"
                                        }

                                    </strong>

                                </div>


                            </div>

                        </div>


                        {/* ========================================
                            MAP
                        ======================================== */}

                        {
                            hasValidLocation ? (

                                <div className="incident-details-map">

                                    <MapContainer

                                        center={[
                                            latitude,
                                            longitude
                                        ]}

                                        zoom={
                                            13
                                        }

                                        scrollWheelZoom={
                                            true
                                        }

                                        style={{
                                            height:
                                                "400px",

                                            width:
                                                "100%"
                                        }}
                                    >

                                        <TileLayer

                                            attribution="&copy; OpenStreetMap contributors"

                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                                        />


                                        <Marker

                                            position={[
                                                latitude,
                                                longitude
                                            ]}

                                        >

                                            <Popup>


                                                <strong>

                                                    🚨{" "}

                                                    {
                                                        incident.title ||
                                                        "Unknown Incident"
                                                    }

                                                </strong>


                                                <br />


                                                Type:{" "}

                                                {
                                                    formattedDisasterType
                                                }


                                                <br />


                                                Severity:{" "}

                                                {
                                                    severity
                                                }


                                                <br />


                                                Status:{" "}

                                                {
                                                    formattedStatus
                                                }


                                                <br />


                                                People affected:{" "}

                                                {
                                                    incident.peopleAffected ??
                                                    0
                                                }


                                            </Popup>

                                        </Marker>

                                    </MapContainer>

                                </div>

                            ) : (

                                <div className="incident-details-card">

                                    <p>

                                        Map unavailable because
                                        this incident does not
                                        have valid coordinates.

                                    </p>

                                </div>

                            )
                        }


                        {/* ========================================
                            ACTIONS
                        ======================================== */}

                        {
                            (
                                canEdit ||
                                canDelete
                            ) && (

                                <div className="incident-details-actions">


                                    {
                                        canEdit && (

                                            <button
                                                className="details-edit-button"

                                                onClick={
                                                    handleEdit
                                                }
                                            >

                                                ✏️ Edit Incident

                                            </button>

                                        )
                                    }


                                    {
                                        canDelete && (

                                            <button
                                                className="details-delete-button"

                                                onClick={
                                                    handleDelete
                                                }
                                            >

                                                🗑 Delete Incident

                                            </button>

                                        )
                                    }


                                </div>

                            )
                        }


                    </div>

                </main>

            </div>

        </div>

    );

}


export default IncidentDetails;