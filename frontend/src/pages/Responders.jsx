import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "../css/responders.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getResponders,
    deleteResponder
} from "../services/responderService.js";


function Responders() {

    const navigate =
        useNavigate();


    const [responders, setResponders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [roleFilter, setRoleFilter] =
        useState("ALL");


    // =========================
    // LOAD RESPONDERS
    // =========================

    useEffect(() => {

        const fetchResponders =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const data =
                        await getResponders();


                    if (
                        Array.isArray(
                            data?.responders
                        )
                    ) {

                        setResponders(
                            data.responders
                        );

                    } else if (
                        Array.isArray(data)
                    ) {

                        setResponders(data);

                    } else {

                        setResponders([]);

                    }

                } catch (error) {

                    console.error(error);

                    setError(
                        "Failed to load responders."
                    );

                } finally {

                    setLoading(false);

                }

            };


        fetchResponders();

    }, []);


    // =========================
    // DELETE
    // =========================

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Delete this responder?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteResponder(id);


                setResponders(
                    (previous) =>
                        previous.filter(
                            (responder) =>
                                responder._id !== id
                        )
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to delete responder."
                );

            }

        };


    // =========================
    // FILTER
    // =========================

    const filteredResponders =
        responders.filter(
            (responder) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                const matchesSearch =

                    responder.name
                        ?.toLowerCase()
                        .includes(searchText) ||

                    responder.teamName
                        ?.toLowerCase()
                        .includes(searchText);


                const matchesStatus =

                    statusFilter === "ALL" ||

                    responder.status ===
                        statusFilter;


                const matchesRole =

                    roleFilter === "ALL" ||

                    responder.role ===
                        roleFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesRole
                );

            }
        );


    const availableCount =
        responders.filter(
            (responder) =>
                responder.status ===
                "AVAILABLE"
        ).length;


    const deployedCount =
        responders.filter(
            (responder) =>
                responder.status ===
                "DEPLOYED"
        ).length;


    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    {/* HEADER */}

                    <div className="responders-header">

                        <div>

                            <h1>
                                👨‍🚒 Responder Management
                            </h1>

                            <p>
                                Manage emergency response
                                personnel and rescue teams.
                            </p>

                        </div>


                        <button
                            className="add-responder-button"

                            onClick={() =>
                                navigate(
                                    "/responders/create"
                                )
                            }
                        >

                            + Add Responder

                        </button>

                    </div>


                    {/* STATS */}

                    <div className="responder-stats">

                        <div className="responder-stat-card">

                            <span>
                                👨‍🚒
                            </span>

                            <div>

                                <p>
                                    Total Responders
                                </p>

                                <h2>
                                    {
                                        responders.length
                                    }
                                </h2>

                            </div>

                        </div>


                        <div className="responder-stat-card">

                            <span>
                                ✅
                            </span>

                            <div>

                                <p>
                                    Available
                                </p>

                                <h2>
                                    {
                                        availableCount
                                    }
                                </h2>

                            </div>

                        </div>


                        <div className="responder-stat-card">

                            <span>
                                🚨
                            </span>

                            <div>

                                <p>
                                    Deployed
                                </p>

                                <h2>
                                    {
                                        deployedCount
                                    }
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* CONTROLS */}

                    <div className="responder-controls">

                        <input
                            type="text"

                            placeholder="🔍 Search responder or team..."

                            value={search}

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />


                        <select
                            value={roleFilter}

                            onChange={(event) =>
                                setRoleFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Roles
                            </option>

                            <option value="MEDICAL">
                                Medical
                            </option>

                            <option value="FIRE_RESCUE">
                                Fire Rescue
                            </option>

                            <option value="POLICE">
                                Police
                            </option>

                            <option value="SEARCH_RESCUE">
                                Search & Rescue
                            </option>

                            <option value="DRONE_OPERATOR">
                                Drone Operator
                            </option>

                            <option value="VOLUNTEER">
                                Volunteer
                            </option>

                            <option value="OTHER">
                                Other
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

                            <option value="AVAILABLE">
                                Available
                            </option>

                            <option value="DEPLOYED">
                                Deployed
                            </option>

                            <option value="OFF_DUTY">
                                Off Duty
                            </option>

                        </select>

                    </div>


                    {error && (

                        <div className="responder-error">

                            {error}

                        </div>

                    )}


                    {loading && (

                        <div className="responder-loading">

                            Loading responders...

                        </div>

                    )}


                    {!loading &&
                        filteredResponders.length === 0 && (

                            <div className="responder-empty">

                                <h2>
                                    No responders found
                                </h2>

                                <p>
                                    Add your first emergency
                                    responder.
                                </p>

                            </div>

                        )}


                    {/* GRID */}

                    {!loading &&
                        filteredResponders.length > 0 && (

                            <div className="responder-grid">


                                {
                                    filteredResponders.map(
                                        (responder) => (

                                            <div
                                                className="responder-card"

                                                key={
                                                    responder._id
                                                }
                                            >


                                                <div className="responder-card-header">

                                                    <div className="responder-avatar">

                                                        👨‍🚒

                                                    </div>


                                                    <div>

                                                        <h2>

                                                            {
                                                                responder.name
                                                            }

                                                        </h2>


                                                        <p>

                                                            {
                                                                responder.teamName
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="responder-details">


                                                    <div>

                                                        <span>
                                                            Role
                                                        </span>

                                                        <strong>

                                                            {
                                                                responder.role
                                                                    ?.replaceAll(
                                                                        "_",
                                                                        " "
                                                                    )
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Status
                                                        </span>


                                                        <strong
                                                            className={`responder-status ${
                                                                responder.status
                                                                    ?.toLowerCase()
                                                            }`}
                                                        >

                                                            {
                                                                responder.status
                                                                    ?.replace(
                                                                        "_",
                                                                        " "
                                                                    )
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Location
                                                        </span>

                                                        <strong>

                                                            {
                                                                responder.location
                                                                    ?.latitude ??
                                                                "N/A"
                                                            }

                                                            ,{" "}

                                                            {
                                                                responder.location
                                                                    ?.longitude ??
                                                                "N/A"
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* SKILLS */}

                                                <div className="responder-skills">

                                                    <p>
                                                        Skills
                                                    </p>


                                                    <div>

                                                        {
                                                            responder.skills
                                                                ?.length >
                                                            0
                                                                ? responder.skills.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (

                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                        >

                                                                            {
                                                                                skill
                                                                            }

                                                                        </span>

                                                                    )
                                                                )

                                                                : (
                                                                    <span>
                                                                        No skills added
                                                                    </span>
                                                                )
                                                        }

                                                    </div>

                                                </div>


                                                {/* ASSIGNED INCIDENT */}

                                                {
                                                    responder.assignedIncident && (

                                                        <div className="assigned-incident">

                                                            🚨 Assigned:{" "}

                                                            <strong>

                                                                {
                                                                    responder
                                                                        .assignedIncident
                                                                        .title
                                                                }

                                                            </strong>

                                                        </div>

                                                    )
                                                }


                                                <div className="responder-actions">


                                                    <button
                                                        className="responder-edit"

                                                        onClick={() =>
                                                            navigate(
                                                                `/responders/${responder._id}/edit`
                                                            )
                                                        }
                                                    >

                                                        ✏️ Edit

                                                    </button>


                                                    <button
                                                        className="responder-delete"

                                                        onClick={() =>
                                                            handleDelete(
                                                                responder._id
                                                            )
                                                        }
                                                    >

                                                        🗑 Delete

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        )}

                </main>

            </div>

        </div>

    );

}


export default Responders;