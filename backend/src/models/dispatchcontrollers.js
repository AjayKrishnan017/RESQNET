import Incident from "../models/incident.js";
import Responder from "../models/responder.js";


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
// DISASTER RESPONSE PROFILE
// ========================================

const getDisasterProfile = (
    disasterType
) => {

    const profiles = {

        FLOOD: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "DRONE_OPERATOR",
                "POLICE"
            ],

            requiredSkills: [
                "flood",
                "water",
                "swimming",
                "rope",
                "first aid",
                "rescue",
                "evacuation",
                "drone"
            ]

        },


        EARTHQUAKE: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "FIRE_RESCUE",
                "DRONE_OPERATOR"
            ],

            requiredSkills: [
                "search",
                "rescue",
                "first aid",
                "trauma",
                "debris",
                "rope",
                "evacuation",
                "drone"
            ]

        },


        FIRE: {

            preferredRoles: [
                "FIRE_RESCUE",
                "MEDICAL",
                "POLICE",
                "DRONE_OPERATOR"
            ],

            requiredSkills: [
                "fire",
                "burn",
                "first aid",
                "evacuation",
                "rescue",
                "smoke",
                "drone"
            ]

        },


        LANDSLIDE: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "DRONE_OPERATOR",
                "POLICE"
            ],

            requiredSkills: [
                "rope",
                "search",
                "rescue",
                "debris",
                "first aid",
                "evacuation",
                "drone"
            ]

        },


        CYCLONE: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "POLICE",
                "DRONE_OPERATOR"
            ],

            requiredSkills: [
                "evacuation",
                "first aid",
                "rescue",
                "flood",
                "rope",
                "drone"
            ]

        },


        TSUNAMI: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "DRONE_OPERATOR",
                "POLICE"
            ],

            requiredSkills: [
                "water",
                "swimming",
                "rescue",
                "first aid",
                "evacuation",
                "flood",
                "drone"
            ]

        },


        OTHER: {

            preferredRoles: [
                "SEARCH_RESCUE",
                "MEDICAL",
                "POLICE",
                "VOLUNTEER"
            ],

            requiredSkills: [
                "first aid",
                "rescue",
                "evacuation"
            ]

        }

    };


    return (
        profiles[disasterType] ||
        profiles.OTHER
    );
};


// ========================================
// DISTANCE SCORE
// Maximum = 40
// ========================================

const calculateDistanceScore = (
    distance
) => {

    if (
        distance === null ||
        !Number.isFinite(distance)
    ) {
        return 0;
    }


    const maxUsefulDistance = 100;


    const normalizedDistance =
        Math.min(
            distance,
            maxUsefulDistance
        );


    const score =
        40 *
        (
            1 -
            normalizedDistance /
            maxUsefulDistance
        );


    return Math.max(
        0,
        Math.round(score)
    );
};


// ========================================
// ROLE SCORE
// Maximum = 25
// ========================================

const calculateRoleScore = (
    responderRole,
    preferredRoles
) => {

    const index =
        preferredRoles.indexOf(
            responderRole
        );


    if (index === -1) {
        return 0;
    }


    const roleScores = [
        25,
        22,
        19,
        16
    ];


    return (
        roleScores[index] || 10
    );
};


// ========================================
// SKILL SCORE
// Maximum = 20
// ========================================

const calculateSkillScore = (
    responderSkills = [],
    requiredSkills = []
) => {

    const normalizedSkills =
        responderSkills.map(
            (skill) =>
                String(skill)
                    .toLowerCase()
                    .trim()
        );


    const matchedSkills = [];


    for (
        const requiredSkill
        of requiredSkills
    ) {

        const found =
            normalizedSkills.some(
                (skill) =>
                    skill.includes(
                        requiredSkill
                    )
            );


        if (found) {

            matchedSkills.push(
                requiredSkill
            );

        }

    }


    const score =
        Math.min(
            20,
            matchedSkills.length * 5
        );


    return {
        score,
        matchedSkills
    };
};


// ========================================
// READINESS SCORE
// Maximum = 5
// ========================================

const calculateReadinessScore = (
    responder
) => {

    const skillCount =
        responder.skills?.length || 0;


    if (skillCount >= 3) {
        return 5;
    }


    if (skillCount === 2) {
        return 4;
    }


    if (skillCount === 1) {
        return 3;
    }


    return 1;
};


// ========================================
// GET SMART DISPATCH RECOMMENDATIONS
// ========================================

export const getDispatchRecommendations =
    async (req, res) => {

        try {

            const {
                incidentId
            } = req.params;


            // ========================================
            // FIND INCIDENT
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
            // INCIDENT LOCATION
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


            if (
                !Number.isFinite(
                    incidentLatitude
                ) ||

                !Number.isFinite(
                    incidentLongitude
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Incident does not have valid coordinates."

                    });

            }


            // ========================================
            // AVAILABLE RESPONDERS ONLY
            // ========================================

            const responders =
                await Responder.find({

                    status: "AVAILABLE",

                    assignedIncident: null

                }).lean();


            // ========================================
            // DISASTER PROFILE
            // ========================================

            const profile =
                getDisasterProfile(
                    incident.disasterType
                );


            // ========================================
            // SCORE RESPONDERS
            // ========================================

            const recommendations =
                responders.map(
                    (responder) => {

                        const responderLatitude =
                            Number(
                                responder
                                    .location
                                    ?.latitude
                            );


                        const responderLongitude =
                            Number(
                                responder
                                    .location
                                    ?.longitude
                            );


                        let distanceKm =
                            null;


                        if (
                            Number.isFinite(
                                responderLatitude
                            ) &&

                            Number.isFinite(
                                responderLongitude
                            )
                        ) {

                            distanceKm =
                                calculateDistance(

                                    incidentLatitude,

                                    incidentLongitude,

                                    responderLatitude,

                                    responderLongitude

                                );

                        }


                        // DISTANCE

                        const distanceScore =
                            calculateDistanceScore(
                                distanceKm
                            );


                        // ROLE

                        const roleScore =
                            calculateRoleScore(

                                responder.role,

                                profile.preferredRoles

                            );


                        // SKILLS

                        const {
                            score:
                                skillScore,

                            matchedSkills

                        } =
                            calculateSkillScore(

                                responder.skills,

                                profile.requiredSkills

                            );


                        // AVAILABLE = 10

                        const availabilityScore =
                            10;


                        // READINESS

                        const readinessScore =
                            calculateReadinessScore(
                                responder
                            );


                        // ========================================
                        // TOTAL
                        // ========================================

                        const totalScore =
                            Math.min(

                                100,

                                distanceScore +

                                roleScore +

                                skillScore +

                                availabilityScore +

                                readinessScore

                            );


                        // ========================================
                        // REASONS
                        // ========================================

                        const reasons = [];


                        if (
                            distanceKm !== null
                        ) {

                            reasons.push(

                                `${distanceKm.toFixed(
                                    1
                                )} km from incident`

                            );

                        } else {

                            reasons.push(
                                "Responder location unavailable"
                            );

                        }


                        if (
                            roleScore >= 20
                        ) {

                            reasons.push(
                                "Strong role match"
                            );

                        } else if (
                            roleScore > 0
                        ) {

                            reasons.push(
                                "Relevant responder role"
                            );

                        }


                        if (
                            matchedSkills.length > 0
                        ) {

                            reasons.push(

                                `${matchedSkills.length} relevant skill${
                                    matchedSkills.length ===
                                    1
                                        ? ""
                                        : "s"
                                }`

                            );

                        }


                        return {

                            responderId:
                                responder._id,

                            name:
                                responder.name,

                            teamName:
                                responder.teamName,

                            role:
                                responder.role,

                            skills:
                                responder.skills ||
                                [],

                            status:
                                responder.status,

                            location:
                                responder.location,

                            distanceKm:
                                distanceKm ===
                                null
                                    ? null
                                    : Number(
                                        distanceKm.toFixed(
                                            2
                                        )
                                    ),

                            score:
                                totalScore,

                            scoreBreakdown: {

                                distance:
                                    distanceScore,

                                role:
                                    roleScore,

                                skills:
                                    skillScore,

                                availability:
                                    availabilityScore,

                                readiness:
                                    readinessScore

                            },

                            matchedSkills,

                            reasons

                        };

                    }
                );


            // ========================================
            // SORT BEST → WORST
            // ========================================

            recommendations.sort(
                (a, b) =>
                    b.score -
                    a.score
            );


            // ========================================
            // ADD RANK
            // ========================================

            const rankedRecommendations =
                recommendations.map(
                    (
                        recommendation,
                        index
                    ) => ({

                        rank:
                            index + 1,

                        ...recommendation

                    })
                );


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
                        incident.peopleAffected,

                    location:
                        incident.location

                },

                responseProfile: {

                    preferredRoles:
                        profile.preferredRoles,

                    requiredSkills:
                        profile.requiredSkills

                },

                recommendations:
                    rankedRecommendations

            });


        } catch (error) {

            console.error(
                "Smart dispatch error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to generate dispatch recommendations."

            });

        }

    };