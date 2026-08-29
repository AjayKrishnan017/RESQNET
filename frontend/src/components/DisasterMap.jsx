import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function DisasterMap({
    incidents = []
}) {

    const safeIncidents =
        Array.isArray(incidents)
            ? incidents
            : [];


    return (

        <div className="disaster-map">

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


                {
                    safeIncidents.map(
                        (incident) => {

                            const latitude =
                                Number(
                                    incident
                                        ?.location
                                        ?.latitude
                                );

                            const longitude =
                                Number(
                                    incident
                                        ?.location
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
                                        incident._id
                                    }

                                    position={[
                                        latitude,
                                        longitude
                                    ]}

                                >

                                    <Popup>

                                        <strong>

                                            {
                                                incident.title ||
                                                "Unknown Incident"
                                            }

                                        </strong>


                                        <br />


                                        Type:{" "}

                                        {
                                            incident.disasterType ||
                                            "Unknown"
                                        }


                                        <br />


                                        Severity:{" "}

                                        {
                                            incident.severity ||
                                            "Unknown"
                                        }


                                        <br />


                                        Status:{" "}

                                        {
                                            incident.status
                                                ?.replace(
                                                    "_",
                                                    " "
                                                ) ||
                                            "Unknown"
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

            </MapContainer>


            {/* MAP LEGEND */}

            <div className="map-legend">

                <strong>
                    Severity
                </strong>


                <div>

                    <span className="legend-dot low"></span>

                    Low

                </div>


                <div>

                    <span className="legend-dot medium"></span>

                    Medium

                </div>


                <div>

                    <span className="legend-dot high"></span>

                    High

                </div>


                <div>

                    <span className="legend-dot critical"></span>

                    Critical

                </div>

            </div>

        </div>

    );

}


export default DisasterMap;