import {
    useCallback,
    useEffect,
    useState
} from "react";

import "../css/responderAssignment.css";

import {
    getResponders
} from "../services/responderService.js";

import {
    assignResponder,
    releaseResponder
} from "../services/assignmentService.js";


function ResponderAssignment({
    incidentId,
    refreshKey = 0,
    onDeploymentChange
}) {

    const [responders, setResponders] =
        useState([]);

    const [
        selectedResponder,
        setSelectedResponder
    ] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [working, setWorking] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    // ========================================
    // LOAD RESPONDERS
    // ========================================

    const fetchResponders =
        useCallback(async () => {

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

                console.error(
                    "Failed to load responders:",
                    error
                );

                setResponders([]);

                setError(
                    "Failed to load responders."
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        fetchResponders();

    }, [
        fetchResponders,
        incidentId,
        refreshKey
    ]);


    // ========================================
    // GET ASSIGNED INCIDENT ID
    // ========================================

    const getAssignedIncidentId =
        (responder) => {

            if (
                !responder?.assignedIncident
            ) {

                return null;

            }


            if (
                typeof responder
                    .assignedIncident ===
                "string"
            ) {

                return responder
                    .assignedIncident;

            }


            return (
                responder
                    .assignedIncident
                    ?._id || null
            );

        };


    // ========================================
    // RESPONDERS ASSIGNED TO THIS INCIDENT
    // ========================================

    const assignedResponders =
        responders.filter(
            (responder) =>

                getAssignedIncidentId(
                    responder
                ) === incidentId
        );


    // ========================================
    // AVAILABLE RESPONDERS
    // ========================================

    const availableResponders =
        responders.filter(
            (responder) =>

                responder.status ===
                    "AVAILABLE" &&

                !responder
                    .assignedIncident
        );


    // ========================================
    // ASSIGN RESPONDER
    // ========================================

    const handleAssign =
        async () => {

            if (
                !selectedResponder
            ) {

                setError(
                    "Please select a responder."
                );

                return;

            }


            try {

                setWorking(true);

                setError("");

                setMessage("");


                await assignResponder(
                    incidentId,
                    selectedResponder
                );


                setMessage(
                    "Responder deployed successfully."
                );


                setSelectedResponder(
                    ""
                );


                await fetchResponders();


                if (
                    onDeploymentChange
                ) {

                    onDeploymentChange();

                }

            } catch (error) {

                console.error(
                    "Failed to deploy responder:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to assign responder."

                );

            } finally {

                setWorking(false);

            }

        };


    // ========================================
    // RELEASE RESPONDER
    // ========================================

    const handleRelease =
        async (responderId) => {

            const confirmed =
                window.confirm(
                    "Release this responder from the incident?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setWorking(true);

                setError("");

                setMessage("");


                await releaseResponder(
                    responderId
                );


                setMessage(
                    "Responder released successfully."
                );


                await fetchResponders();


                if (
                    onDeploymentChange
                ) {

                    onDeploymentChange();

                }

            } catch (error) {

                console.error(
                    "Failed to release responder:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to release responder."

                );

            } finally {

                setWorking(false);

            }

        };


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="assignment-card">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="assignment-header">

                <div>

                    <h2>
                        👨‍🚒 Response Team Deployment
                    </h2>

                    <p>
                        Manually assign available emergency
                        responders to this incident.
                    </p>

                </div>


                <span className="assignment-count">

                    {
                        assignedResponders.length
                    }{" "}

                    deployed

                </span>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div className="assignment-error">

                    {error}

                </div>

            )}


            {/* ========================================
                SUCCESS
            ======================================== */}

            {message && (

                <div className="assignment-success">

                    {message}

                </div>

            )}


            {/* ========================================
                LOADING
            ======================================== */}

            {loading ? (

                <div className="assignment-loading">

                    Loading responders...

                </div>

            ) : (

                <>


                    {/* ========================================
                        MANUAL DEPLOYMENT
                    ======================================== */}

                    <div className="assignment-controls">


                        <select
                            value={
                                selectedResponder
                            }

                            onChange={(event) =>
                                setSelectedResponder(
                                    event.target.value
                                )
                            }

                            disabled={
                                working ||
                                availableResponders
                                    .length === 0
                            }
                        >

                            <option value="">

                                {
                                    availableResponders
                                        .length === 0

                                        ? "No responders available"

                                        : "Select available responder"
                                }

                            </option>


                            {
                                availableResponders
                                    .map(
                                        (responder) => (

                                            <option
                                                key={
                                                    responder._id
                                                }

                                                value={
                                                    responder._id
                                                }
                                            >

                                                {
                                                    responder.name
                                                }

                                                {" — "}

                                                {
                                                    responder.teamName
                                                }

                                                {" — "}

                                                {
                                                    responder.role
                                                        ?.replaceAll(
                                                            "_",
                                                            " "
                                                        ) ||
                                                    "OTHER"
                                                }

                                            </option>

                                        )
                                    )
                            }

                        </select>


                        <button
                            type="button"

                            className="deploy-button"

                            onClick={
                                handleAssign
                            }

                            disabled={
                                working ||
                                !selectedResponder
                            }
                        >

                            {
                                working

                                    ? "Working..."

                                    : "🚨 Deploy"
                            }

                        </button>

                    </div>


                    {/* ========================================
                        DEPLOYED RESPONDERS
                    ======================================== */}

                    <div className="assigned-team-section">

                        <h3>
                            Deployed Responders
                        </h3>


                        {
                            assignedResponders
                                .length === 0 ? (

                                <div className="no-assigned-team">

                                    No responders are currently
                                    assigned to this incident.

                                </div>

                            ) : (

                                <div className="assigned-team-grid">


                                    {
                                        assignedResponders
                                            .map(
                                                (responder) => (

                                                    <div
                                                        className="assigned-responder-card"

                                                        key={
                                                            responder._id
                                                        }
                                                    >


                                                        <div className="assigned-responder-icon">

                                                            👨‍🚒

                                                        </div>


                                                        <div className="assigned-responder-info">

                                                            <strong>

                                                                {
                                                                    responder.name ||
                                                                    "Unknown Responder"
                                                                }

                                                            </strong>


                                                            <span>

                                                                {
                                                                    responder.teamName ||
                                                                    "Unknown Team"
                                                                }

                                                            </span>


                                                            <span>

                                                                {
                                                                    responder.role
                                                                        ?.replaceAll(
                                                                            "_",
                                                                            " "
                                                                        ) ||
                                                                    "OTHER"
                                                                }

                                                            </span>

                                                        </div>


                                                        <div className="deployed-badge">

                                                            DEPLOYED

                                                        </div>


                                                        <button
                                                            type="button"

                                                            className="release-button"

                                                            onClick={() =>
                                                                handleRelease(
                                                                    responder._id
                                                                )
                                                            }

                                                            disabled={
                                                                working
                                                            }
                                                        >

                                                            Release

                                                        </button>

                                                    </div>

                                                )
                                            )
                                    }

                                </div>

                            )
                        }

                    </div>

                </>

            )}

        </div>

    );

}


export default ResponderAssignment;