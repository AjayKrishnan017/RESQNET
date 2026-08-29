import {
    useEffect,
    useState
} from "react";

import "../css/smartDispatch.css";

import {
    getDispatchRecommendations
} from "../services/dispatchService.js";

import {
    assignResponder
} from "../services/assignmentService.js";


function SmartDispatch({
    incidentId,
    refreshKey = 0,
    onDeploymentChange
}) {

    const [
        recommendations,
        setRecommendations
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        deployingId,
        setDeployingId
    ] = useState(null);


    const [
        error,
        setError
    ] = useState("");


    const [
        message,
        setMessage
    ] = useState("");


    // ========================================
    // LOAD RECOMMENDATIONS
    // ========================================

    const loadRecommendations =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getDispatchRecommendations(
                        incidentId
                    );


                setRecommendations(

                    Array.isArray(
                        data?.recommendations
                    )
                        ? data.recommendations
                        : []

                );


            } catch (error) {

                console.error(
                    "Smart dispatch error:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to generate dispatch recommendations."

                );


            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        if (incidentId) {

            loadRecommendations();

        }

    }, [
        incidentId,
        refreshKey
    ]);


    // ========================================
    // DEPLOY
    // ========================================

    const handleDeploy =
        async (responderId) => {

            try {

                setDeployingId(
                    responderId
                );

                setError("");

                setMessage("");


                await assignResponder(
                    incidentId,
                    responderId
                );


                setMessage(
                    "Recommended responder deployed successfully."
                );


                await loadRecommendations();


                if (
                    onDeploymentChange
                ) {

                    onDeploymentChange();

                }


            } catch (error) {

                console.error(
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to deploy responder."

                );


            } finally {

                setDeployingId(
                    null
                );

            }

        };


    // ========================================
    // RANK EMOJI
    // ========================================

    const getRankIcon = (
        rank
    ) => {

        if (rank === 1) {
            return "🥇";
        }

        if (rank === 2) {
            return "🥈";
        }

        if (rank === 3) {
            return "🥉";
        }

        return `#${rank}`;

    };


    // ========================================
    // SCORE CLASS
    // ========================================

    const getScoreClass = (
        score
    ) => {

        if (score >= 85) {
            return "excellent";
        }

        if (score >= 70) {
            return "good";
        }

        if (score >= 50) {
            return "medium";
        }

        return "low";

    };


    return (

        <div className="smart-dispatch-card">


            {/* HEADER */}

            <div className="smart-dispatch-header">

                <div>

                    <h2>
                        🤖 Smart Dispatch Engine
                    </h2>

                    <p>
                        Ranked response-team recommendations
                        based on distance, role and skills.
                    </p>

                </div>


                <button
                    type="button"

                    className="dispatch-refresh"

                    onClick={
                        loadRecommendations
                    }

                    disabled={
                        loading
                    }
                >
                    ↻ Refresh
                </button>

            </div>


            {/* SCORE FORMULA */}

            <div className="dispatch-formula">

                <span>
                    📍 Distance 40%
                </span>

                <span>
                    👨‍🚒 Role 25%
                </span>

                <span>
                    🛠 Skills 20%
                </span>

                <span>
                    ✅ Availability 10%
                </span>

                <span>
                    ⚡ Readiness 5%
                </span>

            </div>


            {error && (

                <div className="smart-dispatch-error">
                    {error}
                </div>

            )}


            {message && (

                <div className="smart-dispatch-success">
                    {message}
                </div>

            )}


            {loading ? (

                <div className="smart-dispatch-loading">

                    Analysing available response teams...

                </div>

            ) : recommendations.length ===
                0 ? (

                <div className="smart-dispatch-empty">

                    No available responders
                    found for dispatch.

                </div>

            ) : (

                <div className="recommendation-list">


                    {
                        recommendations
                            .slice(0, 5)
                            .map(
                                (
                                    recommendation
                                ) => (

                                    <div
                                        className={`recommendation-card ${
                                            recommendation.rank ===
                                            1
                                                ? "top-recommendation"
                                                : ""
                                        }`}

                                        key={
                                            recommendation.responderId
                                        }
                                    >


                                        {/* TOP */}

                                        <div className="recommendation-top">


                                            <div className="recommendation-rank">

                                                {
                                                    getRankIcon(
                                                        recommendation.rank
                                                    )
                                                }

                                            </div>


                                            <div className="recommendation-identity">

                                                <h3>

                                                    {
                                                        recommendation.teamName
                                                    }

                                                </h3>


                                                <p>

                                                    👨‍🚒{" "}

                                                    {
                                                        recommendation.name
                                                    }

                                                </p>

                                            </div>


                                            <div
                                                className={`dispatch-score ${getScoreClass(
                                                    recommendation.score
                                                )}`}
                                            >

                                                <strong>

                                                    {
                                                        recommendation.score
                                                    }

                                                </strong>

                                                <span>
                                                    /100
                                                </span>

                                            </div>

                                        </div>


                                        {/* MAIN DATA */}

                                        <div className="recommendation-data">


                                            <div>

                                                <span>
                                                    Distance
                                                </span>

                                                <strong>

                                                    {
                                                        recommendation.distanceKm !==
                                                        null

                                                            ? `${recommendation.distanceKm} km`

                                                            : "Unknown"
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Role
                                                </span>

                                                <strong>

                                                    {
                                                        recommendation.role
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

                                                <strong className="available-text">

                                                    AVAILABLE

                                                </strong>

                                            </div>

                                        </div>


                                        {/* SCORE BAR */}

                                        <div className="dispatch-score-bar">

                                            <div
                                                style={{
                                                    width:
                                                        `${recommendation.score}%`
                                                }}
                                            />

                                        </div>


                                        {/* MATCH REASONS */}

                                        <div className="dispatch-reasons">

                                            {
                                                recommendation.reasons?.map(
                                                    (
                                                        reason,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={
                                                                index
                                                            }
                                                        >

                                                            ✓{" "}
                                                            {
                                                                reason
                                                            }

                                                        </span>

                                                    )
                                                )
                                            }

                                        </div>


                                        {/* SKILLS */}

                                        {
                                            recommendation.matchedSkills
                                                ?.length >
                                                0 && (

                                                <div className="dispatch-skills">

                                                    <strong>
                                                        Matching skills
                                                    </strong>


                                                    <div>

                                                        {
                                                            recommendation
                                                                .matchedSkills
                                                                .map(
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
                                                        }

                                                    </div>

                                                </div>

                                            )
                                        }


                                        {/* BREAKDOWN */}

                                        <div className="score-breakdown">

                                            <span>
                                                📍{" "}
                                                {
                                                    recommendation
                                                        .scoreBreakdown
                                                        .distance
                                                }
                                                /40
                                            </span>

                                            <span>
                                                👨‍🚒{" "}
                                                {
                                                    recommendation
                                                        .scoreBreakdown
                                                        .role
                                                }
                                                /25
                                            </span>

                                            <span>
                                                🛠{" "}
                                                {
                                                    recommendation
                                                        .scoreBreakdown
                                                        .skills
                                                }
                                                /20
                                            </span>

                                            <span>
                                                ✅{" "}
                                                {
                                                    recommendation
                                                        .scoreBreakdown
                                                        .availability
                                                }
                                                /10
                                            </span>

                                            <span>
                                                ⚡{" "}
                                                {
                                                    recommendation
                                                        .scoreBreakdown
                                                        .readiness
                                                }
                                                /5
                                            </span>

                                        </div>


                                        {/* DEPLOY */}

                                        <button
                                            type="button"

                                            className="smart-deploy-button"

                                            onClick={() =>
                                                handleDeploy(
                                                    recommendation.responderId
                                                )
                                            }

                                            disabled={
                                                deployingId !==
                                                null
                                            }
                                        >

                                            {
                                                deployingId ===
                                                recommendation.responderId

                                                    ? "Deploying..."

                                                    : recommendation.rank ===
                                                        1

                                                        ? "🚨 Deploy Recommended Team"

                                                        : "Deploy Team"
                                            }

                                        </button>

                                    </div>

                                )
                            )
                    }

                </div>

            )}

        </div>

    );

}


export default SmartDispatch;