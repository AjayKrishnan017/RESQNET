import Incident from "../models/incident.js";
import Responder from "../models/responder.js";
import Shelter from "../models/shelter.js";
import Resource from "../models/resource.js";


// ========================================
// HAVERSINE DISTANCE
// ========================================

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const earthRadius = 6371;

    const toRadians = (degree) =>
        degree * (Math.PI / 180);

    const latitudeDifference =
        toRadians(lat2 - lat1);

    const longitudeDifference =
        toRadians(lon2 - lon1);

    const a =
        Math.sin(
            latitudeDifference / 2
        ) ** 2 +

        Math.cos(
            toRadians(lat1)
        ) *

        Math.cos(
            toRadians(lat2)
        ) *

        Math.sin(
            longitudeDifference / 2
        ) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
};


// ========================================
// SEVERITY SCORE
// MAX 35
// ========================================

const getSeverityScore = (
    severity
) => {

    const scores = {
        LOW: 8,
        MEDIUM: 18,
        HIGH: 28,
        CRITICAL: 35
    };

    return scores[severity] || 0;
};


// ========================================
// PEOPLE SCORE
// MAX 25
// ========================================

const getPeopleScore = (
    peopleAffected
) => {

    const people =
        Number(
            peopleAffected
        ) || 0;

    if (people <= 0) {
        return 0;
    }

    if (people <= 10) {
        return 5;
    }

    if (people <= 50) {
        return 10;
    }

    if (people <= 100) {
        return 15;
    }

    if (people <= 250) {
        return 20;
    }

    return 25;
};


// ========================================
// STATUS SCORE
// MAX 10
// ========================================

const getStatusScore = (
    status
) => {

    const scores = {
        ACTIVE: 10,
        IN_PROGRESS: 6,
        RESOLVED: 0
    };

    return scores[status] || 0;
};


// ========================================
// RESPONSE PROFILE
// ========================================

const getResponseProfile = (
    disasterType
) => {

    const profiles = {

        FLOOD: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 2
            },
            {
                role: "MEDICAL",
                baseCount: 1
            },
            {
                role: "DRONE_OPERATOR",
                baseCount: 1
            }
        ],

        EARTHQUAKE: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 2
            },
            {
                role: "MEDICAL",
                baseCount: 2
            },
            {
                role: "FIRE_RESCUE",
                baseCount: 1
            }
        ],

        FIRE: [
            {
                role: "FIRE_RESCUE",
                baseCount: 2
            },
            {
                role: "MEDICAL",
                baseCount: 1
            },
            {
                role: "POLICE",
                baseCount: 1
            }
        ],

        LANDSLIDE: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 2
            },
            {
                role: "MEDICAL",
                baseCount: 1
            },
            {
                role: "DRONE_OPERATOR",
                baseCount: 1
            }
        ],

        CYCLONE: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 2
            },
            {
                role: "MEDICAL",
                baseCount: 1
            },
            {
                role: "POLICE",
                baseCount: 1
            }
        ],

        TSUNAMI: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 3
            },
            {
                role: "MEDICAL",
                baseCount: 2
            },
            {
                role: "DRONE_OPERATOR",
                baseCount: 1
            }
        ],

        OTHER: [
            {
                role: "SEARCH_RESCUE",
                baseCount: 1
            },
            {
                role: "MEDICAL",
                baseCount: 1
            },
            {
                role: "POLICE",
                baseCount: 1
            }
        ]

    };

    return (
        profiles[disasterType] ||
        profiles.OTHER
    );
};


// ========================================
// RESPONSE SCALE
// ========================================

const getResponseMultiplier = (
    peopleAffected,
    severity
) => {

    const people =
        Number(
            peopleAffected
        ) || 0;

    let multiplier = 1;

    if (people >= 50) {
        multiplier += 0.5;
    }

    if (people >= 150) {
        multiplier += 0.5;
    }

    if (people >= 300) {
        multiplier += 0.5;
    }

    if (severity === "CRITICAL") {
        multiplier += 0.5;
    }

    return multiplier;
};


// ========================================
// RESOURCE REQUIREMENTS
// ========================================

const calculateResourceNeeds = (
    peopleAffected
) => {

    const people =
        Math.max(
            0,
            Number(
                peopleAffected
            ) || 0
        );

    return {

        WATER: {
            amount:
                people * 3,

            unit:
                "L"
        },

        FOOD: {
            amount:
                people,

            unit:
                "kits"
        },

        MEDICAL: {
            amount:
                Math.ceil(
                    people / 10
                ),

            unit:
                "kits"
        }

    };
};


// ========================================
// FIND RESOURCE TOTAL
// ========================================

const getAvailableResourceQuantity = (
    resources,
    category
) => {

    return resources
        .filter(
            (resource) =>
                resource.category ===
                category
        )
        .reduce(
            (
                total,
                resource
            ) => {

                return (
                    total +
                    (
                        Number(
                            resource.quantity
                        ) || 0
                    )
                );

            },
            0
        );
};


// ========================================
// DECISION ENGINE
// ========================================

export const getDecisionAnalysis =
    async (req, res) => {

        try {

            const {
                incidentId
            } = req.params;


            // ========================================
            // LOAD INCIDENT
            // ========================================

            const incident =
                await Incident.findById(
                    incidentId
                );


            if (!incident) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Incident not found."

                    });

            }


            // ========================================
            // LOAD OPERATIONAL DATA
            // ========================================

            const [
                responders,
                shelters,
                resources
            ] =
                await Promise.all([

                    Responder.find()
                        .lean(),

                    Shelter.find()
                        .lean(),

                    Resource.find()
                        .lean()

                ]);


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
            // REQUIRED RESPONSE PROFILE
            // ========================================

            const responseProfile =
                getResponseProfile(
                    incident.disasterType
                );


            const multiplier =
                getResponseMultiplier(

                    incident.peopleAffected,

                    incident.severity

                );


            const recommendedTeams =
                responseProfile.map(
                    (requirement) => {

                        const required =
                            Math.max(
                                1,

                                Math.ceil(
                                    requirement
                                        .baseCount *
                                    multiplier
                                )
                            );


                        const available =
                            availableResponders.filter(
                                (responder) =>
                                    responder.role ===
                                    requirement.role
                            ).length;


                        const shortage =
                            Math.max(
                                0,

                                required -
                                available
                            );


                        return {

                            role:
                                requirement.role,

                            required,

                            available,

                            shortage

                        };

                    }
                );


            // ========================================
            // RESPONSE GAP SCORE
            // MAX 15
            // ========================================

            const totalRequiredTeams =
                recommendedTeams.reduce(
                    (
                        total,
                        team
                    ) =>
                        total +
                        team.required,

                    0
                );


            const totalTeamShortage =
                recommendedTeams.reduce(
                    (
                        total,
                        team
                    ) =>
                        total +
                        team.shortage,

                    0
                );


            let responseGapScore =
                0;


            if (
                totalRequiredTeams > 0
            ) {

                const shortageRatio =
                    totalTeamShortage /
                    totalRequiredTeams;


                if (
                    shortageRatio >=
                    0.5
                ) {

                    responseGapScore =
                        15;

                } else if (
                    shortageRatio > 0
                ) {

                    responseGapScore =
                        8;

                }

            }


            // ========================================
            // FIND BEST SHELTER
            // ========================================

            const incidentLatitude =
                Number(
                    incident.location
                        ?.latitude
                );


            const incidentLongitude =
                Number(
                    incident.location
                        ?.longitude
                );


            const usableShelters =
                shelters
                    .map(
                        (shelter) => {

                            const capacity =
                                Number(
                                    shelter.capacity
                                ) || 0;


                            const occupied =
                                Number(
                                    shelter.occupied
                                ) || 0;


                            const availableSpace =
                                Math.max(
                                    0,

                                    capacity -
                                    occupied
                                );


                            const shelterLatitude =
                                Number(
                                    shelter.location
                                        ?.latitude
                                );


                            const shelterLongitude =
                                Number(
                                    shelter.location
                                        ?.longitude
                                );


                            let distanceKm =
                                null;


                            if (
                                Number.isFinite(
                                    incidentLatitude
                                ) &&

                                Number.isFinite(
                                    incidentLongitude
                                ) &&

                                Number.isFinite(
                                    shelterLatitude
                                ) &&

                                Number.isFinite(
                                    shelterLongitude
                                )
                            ) {

                                distanceKm =
                                    calculateDistance(

                                        incidentLatitude,

                                        incidentLongitude,

                                        shelterLatitude,

                                        shelterLongitude

                                    );

                            }


                            return {

                                ...shelter,

                                availableSpace,

                                distanceKm

                            };

                        }
                    )
                    .filter(
                        (shelter) =>

                            shelter.status ===
                                "OPEN" &&

                            shelter.availableSpace >
                                0
                    );


            usableShelters.sort(
                (a, b) => {

                    if (
                        a.distanceKm === null
                    ) {
                        return 1;
                    }

                    if (
                        b.distanceKm === null
                    ) {
                        return -1;
                    }

                    return (
                        a.distanceKm -
                        b.distanceKm
                    );

                }
            );


            const recommendedShelter =
                usableShelters[0] ||
                null;


            // ========================================
            // SHELTER PRESSURE SCORE
            // MAX 10
            // ========================================

            let shelterPressureScore =
                0;


            if (
                !recommendedShelter
            ) {

                shelterPressureScore =
                    10;

            } else {

                const capacity =
                    Number(
                        recommendedShelter
                            .capacity
                    ) || 0;


                const occupied =
                    Number(
                        recommendedShelter
                            .occupied
                    ) || 0;


                const occupancyRate =
                    capacity > 0

                        ? (
                            occupied /
                            capacity
                        ) * 100

                        : 100;


                if (
                    Number(
                        incident.peopleAffected
                    ) >
                    recommendedShelter
                        .availableSpace
                ) {

                    shelterPressureScore =
                        10;

                } else if (
                    occupancyRate >=
                    80
                ) {

                    shelterPressureScore =
                        8;

                } else if (
                    occupancyRate >=
                    60
                ) {

                    shelterPressureScore =
                        5;

                } else {

                    shelterPressureScore =
                        2;

                }

            }


            // ========================================
            // RESOURCE REQUIREMENTS
            // ========================================

            const resourceNeeds =
                calculateResourceNeeds(
                    incident.peopleAffected
                );


            const resourceRecommendations =
                Object.entries(
                    resourceNeeds
                )
                .map(
                    ([
                        category,
                        requirement
                    ]) => {

                        const available =
                            getAvailableResourceQuantity(

                                resources,

                                category

                            );


                        const shortage =
                            Math.max(

                                0,

                                requirement.amount -
                                available

                            );


                        return {

                            category,

                            required:
                                requirement.amount,

                            available,

                            shortage,

                            unit:
                                requirement.unit,

                            sufficient:
                                shortage === 0

                        };

                    }
                );


            // ========================================
            // RESOURCE PRESSURE
            // MAX 5
            // ========================================

            const resourceShortageCount =
                resourceRecommendations.filter(
                    (resource) =>
                        !resource.sufficient
                ).length;


            const resourcePressureScore =
                Math.min(
                    5,

                    resourceShortageCount *
                    2
                );


            // ========================================
            // PRIORITY SCORE
            // ========================================

            const severityScore =
                getSeverityScore(
                    incident.severity
                );


            const peopleScore =
                getPeopleScore(
                    incident.peopleAffected
                );


            const statusScore =
                getStatusScore(
                    incident.status
                );


            const priorityScore =
                Math.min(

                    100,

                    severityScore +

                    peopleScore +

                    statusScore +

                    responseGapScore +

                    shelterPressureScore +

                    resourcePressureScore

                );


            // ========================================
            // PRIORITY LEVEL
            // ========================================

            let priorityLevel =
                "LOW";


            if (
                priorityScore >= 85
            ) {

                priorityLevel =
                    "CRITICAL";

            } else if (
                priorityScore >= 65
            ) {

                priorityLevel =
                    "HIGH";

            } else if (
                priorityScore >= 40
            ) {

                priorityLevel =
                    "MODERATE";

            }


            // ========================================
            // REASONS
            // ========================================

            const reasons = [];


            if (
                incident.severity ===
                "CRITICAL"
            ) {

                reasons.push(
                    "Incident severity is CRITICAL."
                );

            } else if (
                incident.severity ===
                "HIGH"
            ) {

                reasons.push(
                    "Incident has HIGH severity."
                );

            }


            if (
                Number(
                    incident.peopleAffected
                ) >= 100
            ) {

                reasons.push(

                    `${incident.peopleAffected} people are affected.`

                );

            }


            if (
                totalTeamShortage > 0
            ) {

                reasons.push(

                    `${totalTeamShortage} recommended response team position${
                        totalTeamShortage === 1
                            ? ""
                            : "s"
                    } currently unavailable.`

                );

            }


            if (
                !recommendedShelter
            ) {

                reasons.push(
                    "No open shelter with available capacity was found."
                );

            } else if (
                Number(
                    incident.peopleAffected
                ) >
                recommendedShelter
                    .availableSpace
            ) {

                reasons.push(
                    "Nearest available shelter cannot accommodate all affected people."
                );

            }


            resourceRecommendations
                .filter(
                    (resource) =>
                        !resource.sufficient
                )
                .forEach(
                    (resource) => {

                        reasons.push(

                            `${resource.category} shortage of ${resource.shortage} ${resource.unit}.`

                        );

                    }
                );


            if (
                reasons.length === 0
            ) {

                reasons.push(
                    "Current operational capacity is sufficient for this incident."
                );

            }


            // ========================================
            // RESPONSE
            // ========================================

            res.status(200).json({

                success: true,

                incident: {

                    _id:
                        incident._id,

                    title:
                        incident.title,

                    disasterType:
                        incident.disasterType,

                    severity:
                        incident.severity,

                    status:
                        incident.status,

                    peopleAffected:
                        incident.peopleAffected

                },


                decision: {

                    priorityScore,

                    priorityLevel,


                    scoreBreakdown: {

                        severity:
                            severityScore,

                        peopleAffected:
                            peopleScore,

                        incidentStatus:
                            statusScore,

                        responderPressure:
                            responseGapScore,

                        shelterPressure:
                            shelterPressureScore,

                        resourcePressure:
                            resourcePressureScore

                    },


                    recommendedTeams,


                    recommendedShelter:
                        recommendedShelter

                            ? {

                                _id:
                                    recommendedShelter._id,

                                name:
                                    recommendedShelter.name,

                                capacity:
                                    recommendedShelter.capacity,

                                occupied:
                                    recommendedShelter.occupied,

                                availableSpace:
                                    recommendedShelter.availableSpace,

                                distanceKm:
                                    recommendedShelter.distanceKm ===
                                    null

                                        ? null

                                        : Number(
                                            recommendedShelter
                                                .distanceKm
                                                .toFixed(
                                                    2
                                                )
                                        ),

                                location:
                                    recommendedShelter.location

                            }

                            : null,


                    resources:
                        resourceRecommendations,


                    reasons

                }

            });

        } catch (error) {

            console.error(
                "Decision engine error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Decision analysis failed."

            });

        }

    };