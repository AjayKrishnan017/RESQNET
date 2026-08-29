import {
    useEffect,
    useState
} from "react";

import "../css/geoIntelligence.css";

import {
    getIncidentGeoIntelligence
} from "../services/geoService.js";


function GeoIntelligence({
    incidentId,
    refreshKey = 0
}) {

    const [
        data,
        setData
    ] = useState(null);


    const [
        radius,
        setRadius
    ] = useState(50);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // ========================================
    // LOAD GEO INTELLIGENCE
    // ========================================

    const loadGeoData =
        async (
            selectedRadius =
                radius
        ) => {

            try {

                setLoading(true);

                setError("");


                const result =
                    await getIncidentGeoIntelligence(
                        incidentId,
                        selectedRadius
                    );


                setData(
                    result
                );


            } catch (error) {

                console.error(
                    "Geo intelligence error:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to generate geospatial intelligence."

                );


            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        if (incidentId) {

            loadGeoData(
                radius
            );

        }

    }, [
        incidentId,
        refreshKey
    ]);


    // ========================================
    // CHANGE RADIUS
    // ========================================

    const handleRadiusChange =
        async (event) => {

            const newRadius =
                Number(
                    event.target.value
                );


            setRadius(
                newRadius
            );


            await loadGeoData(
                newRadius
            );

        };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <section className="geo-panel">

                <div className="geo-state">

                    🌍 Analysing operational geography...

                </div>

            </section>

        );

    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (

            <section className="geo-panel">

                <div className="geo-error">

                    {error}

                </div>

            </section>

        );

    }


    if (!data) {

        return null;

    }


    const responders =
        Array.isArray(
            data.responders
        )
            ? data.responders
            : [];


    const shelters =
        Array.isArray(
            data.shelters
        )
            ? data.shelters
            : [];


    return (

        <section className="geo-panel">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="geo-header">


                <div>

                    <h2>
                        🌍 Geospatial Intelligence
                    </h2>


                    <p>
                        Nearby emergency teams and
                        shelters based on incident coordinates.
                    </p>

                </div>


                <div className="geo-radius">

                    <label>
                        Search Radius
                    </label>


                    <select
                        value={
                            radius
                        }

                        onChange={
                            handleRadiusChange
                        }
                    >

                        <option value={10}>
                            10 km
                        </option>

                        <option value={25}>
                            25 km
                        </option>

                        <option value={50}>
                            50 km
                        </option>

                        <option value={100}>
                            100 km
                        </option>

                        <option value={250}>
                            250 km
                        </option>

                    </select>

                </div>

            </div>


            {/* ========================================
                NEAREST RESULTS
            ======================================== */}

            <div className="geo-primary-grid">


                <div className="geo-primary-card">

                    <span>
                        👨‍🚒 Nearest Available Team
                    </span>


                    {
                        data.nearestResponder ? (

                            <>

                                <h3>

                                    {
                                        data
                                            .nearestResponder
                                            .teamName
                                    }

                                </h3>


                                <p>

                                    {
                                        data
                                            .nearestResponder
                                            .name
                                    }

                                    {" • "}

                                    {
                                        data
                                            .nearestResponder
                                            .role
                                            ?.replaceAll(
                                                "_",
                                                " "
                                            )
                                    }

                                </p>


                                <strong>

                                    {
                                        data
                                            .nearestResponder
                                            .distanceKm
                                    }{" "}

                                    km

                                </strong>


                                <small>

                                    Estimated travel:
                                    {" "}

                                    {
                                        data
                                            .nearestResponder
                                            .estimatedMinutes
                                    }{" "}

                                    min*

                                </small>

                            </>

                        ) : (

                            <p>
                                No available responder
                                with valid coordinates.
                            </p>

                        )
                    }

                </div>


                <div className="geo-primary-card">

                    <span>
                        🏥 Nearest Open Shelter
                    </span>


                    {
                        data.nearestShelter ? (

                            <>

                                <h3>

                                    {
                                        data
                                            .nearestShelter
                                            .name
                                    }

                                </h3>


                                <p>

                                    Available space:{" "}

                                    {
                                        data
                                            .nearestShelter
                                            .availableSpace
                                    }

                                </p>


                                <strong>

                                    {
                                        data
                                            .nearestShelter
                                            .distanceKm
                                    }{" "}

                                    km

                                </strong>


                                <small>

                                    Estimated travel:
                                    {" "}

                                    {
                                        data
                                            .nearestShelter
                                            .estimatedMinutes
                                    }{" "}

                                    min*

                                </small>

                            </>

                        ) : (

                            <p>
                                No suitable open shelter
                                found.
                            </p>

                        )
                    }

                </div>

            </div>


            {/* ========================================
                NEARBY RESPONDERS
            ======================================== */}

            <div className="geo-section">


                <div className="geo-section-title">

                    <h3>
                        👨‍🚒 Teams within {radius} km
                    </h3>


                    <span>

                        {
                            responders.length
                        } found

                    </span>

                </div>


                {
                    responders.length ===
                    0 ? (

                        <div className="geo-empty">

                            No available response teams
                            inside this radius.

                        </div>

                    ) : (

                        <div className="geo-list">


                            {
                                responders.map(
                                    (
                                        responder,
                                        index
                                    ) => (

                                        <div
                                            className="geo-list-item"

                                            key={
                                                responder._id
                                            }
                                        >

                                            <div className="geo-rank">

                                                #
                                                {
                                                    index +
                                                    1
                                                }

                                            </div>


                                            <div className="geo-info">

                                                <strong>

                                                    {
                                                        responder.teamName
                                                    }

                                                </strong>


                                                <span>

                                                    {
                                                        responder.name
                                                    }

                                                    {" • "}

                                                    {
                                                        responder.role
                                                            ?.replaceAll(
                                                                "_",
                                                                " "
                                                            )
                                                    }

                                                </span>

                                            </div>


                                            <div className="geo-distance">

                                                <strong>

                                                    {
                                                        responder.distanceKm
                                                    }{" "}

                                                    km

                                                </strong>


                                                <span>

                                                    ~
                                                    {
                                                        responder.estimatedMinutes
                                                    }{" "}

                                                    min

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </div>


            {/* ========================================
                NEARBY SHELTERS
            ======================================== */}

            <div className="geo-section">


                <div className="geo-section-title">

                    <h3>
                        🏥 Shelters within {radius} km
                    </h3>


                    <span>

                        {
                            shelters.length
                        } found

                    </span>

                </div>


                {
                    shelters.length ===
                    0 ? (

                        <div className="geo-empty">

                            No open shelter with
                            capacity inside this radius.

                        </div>

                    ) : (

                        <div className="geo-list">


                            {
                                shelters.map(
                                    (
                                        shelter,
                                        index
                                    ) => (

                                        <div
                                            className="geo-list-item"

                                            key={
                                                shelter._id
                                            }
                                        >

                                            <div className="geo-rank">

                                                #
                                                {
                                                    index +
                                                    1
                                                }

                                            </div>


                                            <div className="geo-info">

                                                <strong>

                                                    {
                                                        shelter.name
                                                    }

                                                </strong>


                                                <span>

                                                    Space:{" "}

                                                    {
                                                        shelter.availableSpace
                                                    }

                                                    {" / "}

                                                    {
                                                        shelter.capacity
                                                    }

                                                </span>

                                            </div>


                                            <div className="geo-distance">

                                                <strong>

                                                    {
                                                        shelter.distanceKm
                                                    }{" "}

                                                    km

                                                </strong>


                                                <span>

                                                    ~
                                                    {
                                                        shelter.estimatedMinutes
                                                    }{" "}

                                                    min

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </div>


            <div className="geo-note">

                * Travel time is a prototype estimate
                based on straight-line distance and an
                assumed average speed. It is not live
                road-routing data.

            </div>

        </section>

    );

}


export default GeoIntelligence;