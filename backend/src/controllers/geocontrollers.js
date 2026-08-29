import Incident from "../models/incident.js";
import Responder from "../models/responder.js";
import Shelter from "../models/shelter.js";


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
// ESTIMATED TRAVEL TIME
// ========================================
//
// This is NOT road-routing ETA.
// It is a simple prototype estimate
// using average emergency travel speed.
//

const calculateEstimatedMinutes = (
    distanceKm
) => {

    if (
        !Number.isFinite(
            distanceKm
        )
    ) {
        return null;
    }

    const averageSpeedKmH =
        40;

    const hours =
        distanceKm /
        averageSpeedKmH;

    return Math.max(
        1,
        Math.round(
            hours * 60
        )
    );
};


// ========================================
// INCIDENT GEO INTELLIGENCE
// ========================================

export const getIncidentGeoIntelligence =
    async (req, res) => {

        try {

            const {
                incidentId
            } = req.params;


            const requestedRadius =
                Number(
                    req.query.radius
                );


            const radiusKm =
                Number.isFinite(
                    requestedRadius
                ) &&
                requestedRadius >
                    0

                    ? requestedRadius

                    : 50;


            // ========================================
            // INCIDENT
            // ========================================

            const incident =
                await Incident.findById(
                    incidentId
                ).lean();


            if (!incident) {

                return res.status(
                    404
                ).json({
                    success: false,
                    message:
                        "Incident not found."
                });

            }


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

                return res.status(
                    400
                ).json({
                    success: false,
                    message:
                        "Incident has invalid coordinates."
                });

            }


            // ========================================
            // LOAD GEO ENTITIES
            // ========================================

            const [
                responders,
                shelters
            ] =
                await Promise.all([

                    Responder.find({
                        status:
                            "AVAILABLE",

                        assignedIncident:
                            null
                    }).lean(),

                    Shelter.find({
                        status:
                            "OPEN"
                    }).lean()

                ]);


            // ========================================
            // RESPONDER DISTANCES
            // ========================================

            const nearbyResponders =
                responders
                    .map(
                        (responder) => {

                            const latitude =
                                Number(
                                    responder.location
                                        ?.latitude
                                );


                            const longitude =
                                Number(
                                    responder.location
                                        ?.longitude
                                );


                            if (
                                !Number.isFinite(
                                    latitude
                                ) ||
                                !Number.isFinite(
                                    longitude
                                )
                            ) {

                                return null;

                            }


                            const distanceKm =
                                calculateDistance(
                                    incidentLatitude,
                                    incidentLongitude,
                                    latitude,
                                    longitude
                                );


                            return {

                                _id:
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
                                    Number(
                                        distanceKm.toFixed(
                                            2
                                        )
                                    ),

                                estimatedMinutes:
                                    calculateEstimatedMinutes(
                                        distanceKm
                                    ),

                                insideRadius:
                                    distanceKm <=
                                    radiusKm

                            };

                        }
                    )
                    .filter(Boolean)
                    .sort(
                        (a, b) =>
                            a.distanceKm -
                            b.distanceKm
                    );


            // ========================================
            // SHELTER DISTANCES
            // ========================================

            const nearbyShelters =
                shelters
                    .map(
                        (shelter) => {

                            const latitude =
                                Number(
                                    shelter.location
                                        ?.latitude
                                );


                            const longitude =
                                Number(
                                    shelter.location
                                        ?.longitude
                                );


                            if (
                                !Number.isFinite(
                                    latitude
                                ) ||
                                !Number.isFinite(
                                    longitude
                                )
                            ) {

                                return null;

                            }


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


                            const distanceKm =
                                calculateDistance(
                                    incidentLatitude,
                                    incidentLongitude,
                                    latitude,
                                    longitude
                                );


                            return {

                                _id:
                                    shelter._id,

                                name:
                                    shelter.name,

                                status:
                                    shelter.status,

                                capacity,

                                occupied,

                                availableSpace,

                                contactNumber:
                                    shelter.contactNumber,

                                location:
                                    shelter.location,

                                distanceKm:
                                    Number(
                                        distanceKm.toFixed(
                                            2
                                        )
                                    ),

                                estimatedMinutes:
                                    calculateEstimatedMinutes(
                                        distanceKm
                                    ),

                                insideRadius:
                                    distanceKm <=
                                    radiusKm

                            };

                        }
                    )
                    .filter(
                        (shelter) =>
                            shelter &&
                            shelter.availableSpace >
                                0
                    )
                    .sort(
                        (a, b) =>
                            a.distanceKm -
                            b.distanceKm
                    );


            // ========================================
            // RESPONSE
            // ========================================

            res.status(200).json({

                success: true,

                radiusKm,

                incident: {
                    _id:
                        incident._id,

                    title:
                        incident.title,

                    disasterType:
                        incident.disasterType,

                    severity:
                        incident.severity,

                    location:
                        incident.location
                },


                nearestResponder:
                    nearbyResponders[0] ||
                    null,


                nearestShelter:
                    nearbyShelters[0] ||
                    null,


                responders:
                    nearbyResponders
                        .filter(
                            (responder) =>
                                responder.insideRadius
                        )
                        .slice(
                            0,
                            10
                        ),


                shelters:
                    nearbyShelters
                        .filter(
                            (shelter) =>
                                shelter.insideRadius
                        )
                        .slice(
                            0,
                            10
                        )

            });

        } catch (error) {

            console.error(
                "Geo intelligence error:",
                error
            );


            res.status(500).json({
                success: false,

                message:
                    error.message ||
                    "Failed to generate geospatial intelligence."
            });

        }

    };