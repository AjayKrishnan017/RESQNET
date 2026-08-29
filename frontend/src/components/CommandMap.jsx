import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ========================================
// CUSTOM MARKER
// ========================================

const createMarker = (
    emoji,
    background
) => {

    return L.divIcon({

        className: "",

        html: `
            <div
                style="
                    width: 34px;
                    height: 34px;

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    background: ${background};

                    border: 3px solid white;

                    border-radius: 50%;

                    box-shadow:
                        0 3px 10px
                        rgba(0,0,0,0.35);

                    font-size: 16px;
                "
            >
                ${emoji}
            </div>
        `,

        iconSize: [
            34,
            34
        ],

        iconAnchor: [
            17,
            17
        ],

        popupAnchor: [
            0,
            -18
        ]

    });

};


// ========================================
// INCIDENT ICON
// ========================================

const getIncidentIcon = (
    severity
) => {

    const colors = {

        LOW:
            "#22c55e",

        MEDIUM:
            "#f59e0b",

        HIGH:
            "#f97316",

        CRITICAL:
            "#dc2626"

    };


    return createMarker(
        "🚨",
        colors[severity] ||
        "#64748b"
    );

};


// ========================================
// RESPONDER ICON
// ========================================

const responderIcon =
    createMarker(
        "👨‍🚒",
        "#2563eb"
    );


// ========================================
// SHELTER ICON
// ========================================

const shelterIcon =
    createMarker(
        "🏥",
        "#16a34a"
    );


// ========================================
// COMMAND MAP
// ========================================

function CommandMap({
    incidents = [],
    responders = [],
    shelters = []
}) {

    const safeIncidents =
        Array.isArray(incidents)
            ? incidents
            : [];


    const safeResponders =
        Array.isArray(responders)
            ? responders
            : [];


    const safeShelters =
        Array.isArray(shelters)
            ? shelters
            : [];


    return (

        <div className="command-map">


            <MapContainer

                center={[
                    11.0168,
                    76.9558
                ]}

                zoom={7}

                scrollWheelZoom={
                    true
                }

            >

                <TileLayer

                    attribution="&copy; OpenStreetMap contributors"

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />


                {/* ========================================
                    INCIDENTS
                ======================================== */}

                {
                    safeIncidents.map(
                        (incident) => {

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


                            return (

                                <Marker

                                    key={
                                        `incident-${incident._id}`
                                    }

                                    position={[
                                        latitude,
                                        longitude
                                    ]}

                                    icon={
                                        getIncidentIcon(
                                            incident.severity
                                        )
                                    }
                                >

                                    <Popup>

                                        <strong>
                                            🚨{" "}
                                            {
                                                incident.title
                                            }
                                        </strong>


                                        <br />


                                        Type:{" "}

                                        {
                                            incident.disasterType
                                        }


                                        <br />


                                        Severity:{" "}

                                        {
                                            incident.severity
                                        }


                                        <br />


                                        Status:{" "}

                                        {
                                            incident.status
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }


                                        <br />


                                        People affected:{" "}

                                        {
                                            incident.peopleAffected ??
                                            0
                                        }

                                    </Popup>

                                </Marker>

                            );

                        }
                    )
                }


                {/* ========================================
                    RESPONDERS
                ======================================== */}

                {
                    safeResponders.map(
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


                            return (

                                <Marker

                                    key={
                                        `responder-${responder._id}`
                                    }

                                    position={[
                                        latitude,
                                        longitude
                                    ]}

                                    icon={
                                        responderIcon
                                    }
                                >

                                    <Popup>

                                        <strong>

                                            👨‍🚒{" "}

                                            {
                                                responder.name
                                            }

                                        </strong>


                                        <br />


                                        Team:{" "}

                                        {
                                            responder.teamName
                                        }


                                        <br />


                                        Role:{" "}

                                        {
                                            responder.role
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }


                                        <br />


                                        Status:{" "}

                                        {
                                            responder.status
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }

                                    </Popup>

                                </Marker>

                            );

                        }
                    )
                }


                {/* ========================================
                    SHELTERS
                ======================================== */}

                {
                    safeShelters.map(
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


                            return (

                                <Marker

                                    key={
                                        `shelter-${shelter._id}`
                                    }

                                    position={[
                                        latitude,
                                        longitude
                                    ]}

                                    icon={
                                        shelterIcon
                                    }
                                >

                                    <Popup>

                                        <strong>

                                            🏥{" "}

                                            {
                                                shelter.name
                                            }

                                        </strong>


                                        <br />


                                        Capacity:{" "}

                                        {
                                            shelter.capacity
                                        }


                                        <br />


                                        Occupied:{" "}

                                        {
                                            shelter.occupied
                                        }


                                        <br />


                                        Status:{" "}

                                        {
                                            shelter.status
                                        }

                                    </Popup>

                                </Marker>

                            );

                        }
                    )
                }


            </MapContainer>


            {/* ========================================
                MAP LEGEND
            ======================================== */}

            <div className="command-map-legend">

                <strong>
                    Live Map
                </strong>


                <span>
                    🔴 Incident
                </span>


                <span>
                    👨‍🚒 Responder
                </span>


                <span>
                    🏥 Shelter
                </span>

            </div>

        </div>

    );

}


export default CommandMap;