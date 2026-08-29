
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "../css/incidents.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getIncidents,
    deleteIncident
} from "../services/incidentService.js";


function Incidents() {

    const navigate = useNavigate();


    const [incidents, setIncidents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // SEARCH

    const [search, setSearch] =
        useState("");


    // FILTERS

    const [severityFilter, setSeverityFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [typeFilter, setTypeFilter] =
        useState("ALL");


    // SORT

    const [sortBy, setSortBy] =
        useState("NEWEST");


    // ========================================
    // LOAD INCIDENTS
    // ========================================

    const fetchIncidents = async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getIncidents();


            if (
                Array.isArray(
                    data?.incidents
                )
            ) {

                setIncidents(
                    data.incidents
                );

            } else if (
                Array.isArray(data)
            ) {

                setIncidents(data);

            } else {

                setIncidents([]);

            }

        } catch (error) {

            console.error(
                "Failed to load incidents:",
                error
            );

            setIncidents([]);

            setError(
                "Failed to load incidents."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchIncidents();

    }, []);


    // ========================================
    // DELETE
    // ========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this incident?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteIncident(id);


            setIncidents(
                (previous) =>

                    previous.filter(
                        (incident) =>
                            incident._id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Failed to delete incident:",
                error
            );

            setError(
                "Failed to delete incident."
            );

        }

    };


    // ========================================
    // CLEAR FILTERS
    // ========================================

    const clearFilters = () => {

        setSearch("");

        setSeverityFilter("ALL");

        setStatusFilter("ALL");

        setTypeFilter("ALL");

        setSortBy("NEWEST");

    };


    // ========================================
    // FILTER
    // ========================================

    const filteredIncidents =
        incidents.filter(
            (incident) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                const title =
                    incident?.title || "";

                const description =
                    incident?.description || "";


                const matchesSearch =

                    title
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    description
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesSeverity =

                    severityFilter === "ALL" ||

                    incident?.severity ===
                        severityFilter;


                const matchesStatus =

                    statusFilter === "ALL" ||

                    incident?.status ===
                        statusFilter;


                const matchesType =

                    typeFilter === "ALL" ||

                    incident?.disasterType ===
                        typeFilter;


                return (

                    matchesSearch &&

                    matchesSeverity &&

                    matchesStatus &&

                    matchesType

                );

            }
        );


    // ========================================
    // SORT
    // ========================================

    const sortedIncidents =
        [...filteredIncidents].sort(
            (a, b) => {


                if (sortBy === "NEWEST") {

                    return (

                        new Date(
                            b.createdAt
                        ) -

                        new Date(
                            a.createdAt
                        )

                    );

                }


                if (sortBy === "OLDEST") {

                    return (

                        new Date(
                            a.createdAt
                        ) -

                        new Date(
                            b.createdAt
                        )

                    );

                }


                if (
                    sortBy === "SEVERITY"
                ) {

                    const severityRank = {

                        CRITICAL: 4,

                        HIGH: 3,

                        MEDIUM: 2,

                        LOW: 1

                    };


                    return (

                        (
                            severityRank[
                                b.severity
                            ] || 0
                        ) -

                        (
                            severityRank[
                                a.severity
                            ] || 0
                        )

                    );

                }


                if (sortBy === "PEOPLE") {

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


                return 0;

            }
        );


    const filtersActive =

        search !== "" ||

        severityFilter !== "ALL" ||

        statusFilter !== "ALL" ||

        typeFilter !== "ALL";


    // ========================================
    // DATE
    // ========================================

    const formatDate = (date) => {

        if (!date) {

            return "Unknown";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "Unknown";

        }


        return (
            parsedDate.toLocaleString()
        );

    };


    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    {/* HEADER */}

                    <div className="incidents-page-header">

                        <div>

                            <h1>
                                🚨 Incident Management
                            </h1>

                            <p>
                                Monitor and manage disaster incidents.
                            </p>

                        </div>


                        <button
                            className="create-incident-button"

                            onClick={() =>
                                navigate(
                                    "/create-incident"
                                )
                            }
                        >

                            + Report Incident

                        </button>

                    </div>


                    {/* CONTROLS */}

                    <div className="incident-controls">


                        <input
                            type="text"

                            placeholder="🔍 Search incidents..."

                            value={search}

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }

                            className="incident-search"
                        />


                        <select
                            value={typeFilter}

                            onChange={(event) =>
                                setTypeFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Disaster Types
                            </option>

                            <option value="FLOOD">
                                Flood
                            </option>

                            <option value="EARTHQUAKE">
                                Earthquake
                            </option>

                            <option value="FIRE">
                                Fire
                            </option>

                            <option value="LANDSLIDE">
                                Landslide
                            </option>

                            <option value="CYCLONE">
                                Cyclone
                            </option>

                            <option value="TSUNAMI">
                                Tsunami
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                        </select>


                        <select
                            value={severityFilter}

                            onChange={(event) =>
                                setSeverityFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Severity
                            </option>

                            <option value="LOW">
                                Low
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="CRITICAL">
                                Critical
                            </option>

                        </select>


                        <select
                            value={statusFilter}

                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="IN_PROGRESS">
                                In Progress
                            </option>

                            <option value="RESOLVED">
                                Resolved
                            </option>

                        </select>


                        <select
                            value={sortBy}

                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                        >

                            <option value="NEWEST">
                                🆕 Newest First
                            </option>

                            <option value="OLDEST">
                                🕐 Oldest First
                            </option>

                            <option value="SEVERITY">
                                🔴 Highest Severity
                            </option>

                            <option value="PEOPLE">
                                👥 Most People Affected
                            </option>

                        </select>


                        {filtersActive && (

                            <button
                                className="clear-filters-button"

                                onClick={
                                    clearFilters
                                }
                            >

                                ✕ Clear

                            </button>

                        )}

                    </div>


                    {/* RESULT COUNT */}

                    {!loading && (

                        <div className="incident-result-count">

                            Showing{" "}

                            <strong>
                                {sortedIncidents.length}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {incidents.length}
                            </strong>

                            {" "}incidents

                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div className="incident-error">

                            {error}

                        </div>

                    )}


                    {/* LOADING */}

                    {loading && (

                        <div className="incident-loading">

                            Loading incidents...

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        sortedIncidents.length === 0 && (

                            <div className="incident-empty">

                                <div className="empty-icon">
                                    🔎
                                </div>

                                <h2>
                                    No incidents found
                                </h2>

                                <p>
                                    Try changing your search or filters.
                                </p>


                                {filtersActive && (

                                    <button
                                        className="clear-filters-button"

                                        onClick={
                                            clearFilters
                                        }
                                    >

                                        Clear Filters

                                    </button>

                                )}

                            </div>

                        )}


                    {/* INCIDENTS */}

                    {!loading &&
                        sortedIncidents.length > 0 && (

                            <div className="incident-management-grid">


                                {sortedIncidents.map(
                                    (incident) => (

                                        <div
                                            className="management-card"

                                            key={
                                                incident._id
                                            }
                                        >


                                            <div className="management-card-header">

                                                <h2>

                                                    {
                                                        incident.title ||
                                                        "Untitled Incident"
                                                    }

                                                </h2>


                                                <span
                                                    className={`severity-badge severity-${
                                                        incident.severity
                                                            ?.toLowerCase() ||
                                                        "medium"
                                                    }`}
                                                >

                                                    {
                                                        incident.severity ||
                                                        "UNKNOWN"
                                                    }

                                                </span>

                                            </div>


                                            <p className="management-description">

                                                {
                                                    incident.description ||
                                                    "No description available."
                                                }

                                            </p>


                                            <div className="incident-meta">

                                                <span>

                                                    🚨{" "}

                                                    {
                                                        incident.disasterType ||
                                                        "OTHER"
                                                    }

                                                </span>


                                                <span>

                                                    👥{" "}

                                                    {
                                                        incident.peopleAffected ??
                                                        0
                                                    }

                                                </span>


                                                <span
                                                    className={`status-badge status-${
                                                        incident.status
                                                            ?.toLowerCase() ||
                                                        "active"
                                                    }`}
                                                >

                                                    {
                                                        incident.status
                                                            ?.replace(
                                                                "_",
                                                                " "
                                                            ) ||
                                                        "UNKNOWN"
                                                    }

                                                </span>

                                            </div>


                                            <div className="incident-timestamp">

                                                🕒 Reported:{" "}

                                                {
                                                    formatDate(
                                                        incident.createdAt
                                                    )
                                                }

                                            </div>


                                            <div className="management-actions">


                                                <button
                                                    className="view-button"

                                                    onClick={() =>
                                                        navigate(
                                                            `/incidents/${incident._id}`
                                                        )
                                                    }
                                                >

                                                    👁 View

                                                </button>


                                                <button
                                                    className="edit-button"

                                                    onClick={() =>
                                                        navigate(
                                                            `/incidents/${incident._id}/edit`
                                                        )
                                                    }
                                                >

                                                    ✏️ Edit

                                                </button>


                                                <button
                                                    className="delete-button"

                                                    onClick={() =>
                                                        handleDelete(
                                                            incident._id
                                                        )
                                                    }
                                                >

                                                    🗑 Delete

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </main>

            </div>

        </div>

    );
}


export default Incidents;