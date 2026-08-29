import {
    useEffect,
    useState
} from "react";

import "../css/aiDecisionPanel.css";

import {
    getDecisionAnalysis
} from "../services/decisionService.js";


function AIDecisionPanel({
    incidentId,
    refreshKey = 0
}) {

    const [decision, setDecision] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD DECISION
    // ========================================

    const loadDecision =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getDecisionAnalysis(
                        incidentId
                    );


                setDecision(
                    data?.decision ||
                    null
                );

            } catch (error) {

                console.error(
                    "Decision engine error:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to generate decision analysis."

                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        if (incidentId) {

            loadDecision();

        }

    }, [
        incidentId,
        refreshKey
    ]);


    // ========================================
    // STATE
    // ========================================

    if (loading) {

        return (

            <div className="ai-decision-panel">

                <div className="ai-decision-loading">

                    🤖 Analysing operational data...

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="ai-decision-panel">

                <div className="ai-decision-error">

                    {error}

                </div>

            </div>

        );

    }


    if (!decision) {

        return null;

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <section className="ai-decision-panel">


            {/* HEADER */}

            <div className="ai-decision-header">


                <div>

                    <h2>
                        🧠 RESQNET Decision Intelligence
                    </h2>

                    <p>
                        Explainable operational analysis
                        using live RESQNET data.
                    </p>

                </div>


                <button
                    type="button"

                    onClick={
                        loadDecision
                    }
                >
                    ↻ Reanalyse
                </button>

            </div>


            {/* PRIORITY */}

            <div className="ai-priority-section">


                <div
                    className={`ai-priority-score ${decision.priorityLevel?.toLowerCase()}`}
                >

                    <strong>

                        {
                            decision.priorityScore
                        }

                    </strong>

                    <span>
                        /100
                    </span>

                </div>


                <div>

                    <span className="ai-priority-label">
                        Operational Priority
                    </span>


                    <h3>

                        {
                            decision.priorityLevel
                        }

                    </h3>

                </div>

            </div>


            {/* SCORE BREAKDOWN */}

            <div className="ai-score-breakdown">


                <div>

                    <span>
                        Severity
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.severity
                        }
                        /35
                    </strong>

                </div>


                <div>

                    <span>
                        People
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.peopleAffected
                        }
                        /25
                    </strong>

                </div>


                <div>

                    <span>
                        Status
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.incidentStatus
                        }
                        /10
                    </strong>

                </div>


                <div>

                    <span>
                        Teams
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.responderPressure
                        }
                        /15
                    </strong>

                </div>


                <div>

                    <span>
                        Shelter
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.shelterPressure
                        }
                        /10
                    </strong>

                </div>


                <div>

                    <span>
                        Resources
                    </span>

                    <strong>
                        {
                            decision
                                .scoreBreakdown
                                ?.resourcePressure
                        }
                        /5
                    </strong>

                </div>

            </div>


            {/* RESPONSE TEAMS */}

            <div className="ai-decision-section">


                <h3>
                    👨‍🚒 Recommended Response
                </h3>


                <div className="ai-team-grid">


                    {
                        decision
                            .recommendedTeams
                            ?.map(
                                (
                                    team
                                ) => (

                                    <div
                                        className="ai-team-card"

                                        key={
                                            team.role
                                        }
                                    >

                                        <strong>

                                            {
                                                team.role
                                                    ?.replaceAll(
                                                        "_",
                                                        " "
                                                    )
                                            }

                                        </strong>


                                        <p>

                                            Required:{" "}

                                            {
                                                team.required
                                            }

                                        </p>


                                        <p>

                                            Available:{" "}

                                            {
                                                team.available
                                            }

                                        </p>


                                        {
                                            team.shortage >
                                                0 ? (

                                                <span className="ai-shortage">

                                                    ⚠️ Shortage:{" "}

                                                    {
                                                        team.shortage
                                                    }

                                                </span>

                                            ) : (

                                                <span className="ai-sufficient">

                                                    ✓ Sufficient

                                                </span>

                                            )
                                        }

                                    </div>

                                )
                            )
                    }

                </div>

            </div>


            {/* SHELTER */}

            <div className="ai-decision-section">


                <h3>
                    🏥 Recommended Shelter
                </h3>


                {
                    decision
                        .recommendedShelter ? (

                        <div className="ai-shelter-card">


                            <strong>

                                {
                                    decision
                                        .recommendedShelter
                                        .name
                                }

                            </strong>


                            <p>

                                Available space:{" "}

                                {
                                    decision
                                        .recommendedShelter
                                        .availableSpace
                                }

                            </p>


                            <p>

                                Distance:{" "}

                                {
                                    decision
                                        .recommendedShelter
                                        .distanceKm !==
                                    null

                                        ? `${decision
                                            .recommendedShelter
                                            .distanceKm} km`

                                        : "Unknown"
                                }

                            </p>

                        </div>

                    ) : (

                        <div className="ai-warning">

                            ⚠️ No suitable open shelter
                            currently available.

                        </div>

                    )
                }

            </div>


            {/* RESOURCES */}

            <div className="ai-decision-section">


                <h3>
                    📦 Resource Requirements
                </h3>


                <div className="ai-resource-grid">


                    {
                        decision
                            .resources
                            ?.map(
                                (
                                    resource
                                ) => (

                                    <div
                                        className="ai-resource-card"

                                        key={
                                            resource.category
                                        }
                                    >

                                        <strong>

                                            {
                                                resource.category
                                            }

                                        </strong>


                                        <p>

                                            Need:{" "}

                                            {
                                                resource.required
                                            }{" "}

                                            {
                                                resource.unit
                                            }

                                        </p>


                                        <p>

                                            Available:{" "}

                                            {
                                                resource.available
                                            }{" "}

                                            {
                                                resource.unit
                                            }

                                        </p>


                                        {
                                            resource.sufficient ? (

                                                <span className="ai-sufficient">

                                                    ✓ Sufficient

                                                </span>

                                            ) : (

                                                <span className="ai-shortage">

                                                    ⚠️ Short:{" "}

                                                    {
                                                        resource.shortage
                                                    }{" "}

                                                    {
                                                        resource.unit
                                                    }

                                                </span>

                                            )
                                        }

                                    </div>

                                )
                            )
                    }

                </div>

            </div>


            {/* REASONING */}

            <div className="ai-decision-section">


                <h3>
                    🧠 Decision Explanation
                </h3>


                <div className="ai-reason-list">


                    {
                        decision
                            .reasons
                            ?.map(
                                (
                                    reason,
                                    index
                                ) => (

                                    <div
                                        key={
                                            index
                                        }
                                    >

                                        <span>
                                            →
                                        </span>

                                        <p>
                                            {
                                                reason
                                            }
                                        </p>

                                    </div>

                                )
                            )
                    }

                </div>

            </div>


            <div className="ai-prototype-note">

                Decision-support prototype.
                Recommendations should be validated
                before real emergency use.

            </div>

        </section>

    );

}


export default AIDecisionPanel;