import { useEffect, useState } from "react";

import "../css/dashboard.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import IncidentCard from "../components/IncidentCard.jsx";
import DisasterMap from "../components/DisasterMap.jsx";

import {
    getIncidents
} from "../services/incidentService.js";


function Dashboard() {

    const [incidents, setIncidents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // LOAD INCIDENTS
    // =========================

    useEffect(() => {

        const fetchIncidents = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getIncidents();


                if (
                    Array.isArray(
                        data?.incidents
                    )
                ) {

                    setIncidents(
                        data.incidents
                    );

                } else if (
                    Array.isArray(data)
                ) {

                    setIncidents(data);

                } else {

                    setIncidents([]);

                }

            } catch (error) {

                console.error(
                    "Failed to load incidents:",
                    error
                );

                setIncidents([]);

                setError(
                    "Failed to load incidents"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchIncidents();

    }, []);


    // =========================
    // DASHBOARD STATS
    // =========================

    const activeIncidents =
        incidents.filter(
            (incident) =>
                incident.status !== "RESOLVED"
        );


    const criticalIncidents =
        incidents.filter(
            (incident) =>
                incident.severity === "CRITICAL"
        );


    const peopleAffected =
        incidents.reduce(
            (total, incident) =>

                total +
                (
                    Number(
                        incident.peopleAffected
                    ) || 0
                ),

            0
        );


    // Show newest incidents first

    const recentIncidents =
        [...incidents]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 6);


    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    {/* HEADER */}

                    <div className="dashboard-header">

                        <div>

                            <h1>
                                Emergency Command Center
                            </h1>

                            <p>
                                Real-time disaster response monitoring
                            </p>

                        </div>

                        <div className="system-status">

                            <span className="status-dot"></span>

                            System Online

                        </div>

                    </div>


                    {/* STATS */}

                    <div className="stats-grid">

                        <StatCard
                            title="Active Incidents"
                            value={
                                activeIncidents.length
                            }
                            icon="🚨"
                        />

                        <StatCard
                            title="Critical Incidents"
                            value={
                                criticalIncidents.length
                            }
                            icon="⚠️"
                        />

                        <StatCard
                            title="People Affected"
                            value={
                                peopleAffected
                            }
                            icon="👥"
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="dashboard-error">

                            {error}

                        </div>

                    )}


                    {/* MAP */}

                    <section className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    🗺️ Disaster Map
                                </h2>

                                <p>
                                    Live incident locations
                                </p>

                            </div>


                            <span className="section-count">

                                {
                                    incidents.length
                                }{" "}

                                incidents

                            </span>

                        </div>


                        <div className="map-wrapper">

                            <DisasterMap
                                incidents={
                                    incidents
                                }
                            />

                        </div>

                    </section>


                    {/* RECENT INCIDENTS */}

                    <section className="dashboard-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    🚨 Recent Incidents
                                </h2>

                                <p>
                                    Latest disaster reports
                                </p>

                            </div>


                            <span className="section-count">

                                {
                                    incidents.length
                                }{" "}

                                total

                            </span>

                        </div>


                        {loading && (

                            <div className="dashboard-loading">

                                Loading incidents...

                            </div>

                        )}


                        {!loading &&
                            recentIncidents.length === 0 && (

                                <div className="dashboard-empty">

                                    No incidents reported.

                                </div>

                            )}


                        {!loading &&
                            recentIncidents.length > 0 && (

                                <div className="incident-grid">

                                    {
                                        recentIncidents.map(
                                            (incident) => (

                                                <IncidentCard
                                                    key={
                                                        incident._id
                                                    }
                                                    incident={
                                                        incident
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </div>

                            )}

                    </section>

                </main>

            </div>

        </div>

    );

}


export default Dashboard;