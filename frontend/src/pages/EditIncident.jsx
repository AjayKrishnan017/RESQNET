import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../css/editIncident.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getIncidentById,
    updateIncident
} from "../services/incidentService.js";


function EditIncident() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        disasterType: "FLOOD",
        severity: "MEDIUM",
        latitude: "",
        longitude: "",
        peopleAffected: "",
        status: "ACTIVE"
    });


    // =========================
    // LOAD INCIDENT
    // =========================

    useEffect(() => {

        const loadIncident = async () => {

            try {

                const data = await getIncidentById(id);

                const incident = data.incident || data;

                setFormData({
                    title: incident.title || "",
                    description: incident.description || "",
                    disasterType: incident.disasterType || "FLOOD",
                    severity: incident.severity || "MEDIUM",

                    latitude:
                        incident.location?.latitude ?? "",

                    longitude:
                        incident.location?.longitude ?? "",

                    peopleAffected:
                        incident.peopleAffected ?? "",

                    status:
                        incident.status || "ACTIVE"
                });

            } catch (error) {

                console.error("Failed to load incident:", error);

                setError("Failed to load incident.");

            } finally {

                setLoading(false);

            }
        };


        loadIncident();

    }, [id]);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =========================
    // UPDATE INCIDENT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);
        setError("");

        try {

            const incidentData = {

                title: formData.title,

                description: formData.description,

                disasterType: formData.disasterType,

                severity: formData.severity,

                location: {
                    latitude: Number(formData.latitude),
                    longitude: Number(formData.longitude)
                },

                peopleAffected:
                    Number(formData.peopleAffected),

                status: formData.status
            };


            await updateIncident(id, incidentData);


            // Go back to incident management
            navigate("/incidents");


        } catch (error) {

            console.error("Failed to update incident:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update incident."
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="dashboard">

                <Navbar />

                <div className="dashboard-layout">

                    <Sidebar />

                    <main className="main-content">

                        <div className="edit-loading">
                            Loading incident...
                        </div>

                    </main>

                </div>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="dashboard">

                <Navbar />

                <div className="dashboard-layout">

                    <Sidebar />

                    <main className="main-content">

                        <div className="edit-error">

                            <h2>Unable to load incident</h2>

                            <p>{error}</p>

                            <button
                                onClick={() => navigate("/incidents")}
                            >
                                ← Back to Incidents
                            </button>

                        </div>

                    </main>

                </div>

            </div>
        );

    }


    return (

        <div className="dashboard">

            <Navbar />

            <div className="dashboard-layout">

                <Sidebar />

                <main className="main-content">

                    <div className="edit-incident-container">

                        <div className="edit-header">

                            <h1>✏️ Edit Incident</h1>

                            <p>
                                Update disaster information and
                                emergency response status.
                            </p>

                        </div>


                        <form
                            className="edit-form"
                            onSubmit={handleSubmit}
                        >


                            {/* TITLE */}

                            <div className="form-group">

                                <label>
                                    Incident Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* DISASTER TYPE */}

                            <div className="form-group">

                                <label>
                                    Disaster Type
                                </label>

                                <select
                                    name="disasterType"
                                    value={formData.disasterType}
                                    onChange={handleChange}
                                >

                                    <option value="FLOOD">
                                        Flood
                                    </option>

                                    <option value="EARTHQUAKE">
                                        Earthquake
                                    </option>

                                    <option value="FIRE">
                                        Fire
                                    </option>

                                    <option value="LANDSLIDE">
                                        Landslide
                                    </option>

                                    <option value="CYCLONE">
                                        Cyclone
                                    </option>

                                    <option value="TSUNAMI">
                                        Tsunami
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* SEVERITY */}

                            <div className="form-group">

                                <label>
                                    Severity
                                </label>

                                <select
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                >

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="CRITICAL">
                                        Critical
                                    </option>

                                </select>

                            </div>


                            {/* LOCATION */}

                            <div className="location-grid">

                                <div className="form-group">

                                    <label>
                                        Latitude
                                    </label>

                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        step="any"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Longitude
                                    </label>

                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        step="any"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PEOPLE */}

                            <div className="form-group">

                                <label>
                                    People Affected
                                </label>

                                <input
                                    type="number"
                                    name="peopleAffected"
                                    value={formData.peopleAffected}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >

                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="IN_PROGRESS">
                                        In Progress
                                    </option>

                                    <option value="RESOLVED">
                                        Resolved
                                    </option>

                                </select>

                            </div>


                            {/* BUTTONS */}

                            <div className="edit-buttons">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        navigate("/incidents")
                                    }
                                >
                                    ← Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default EditIncident;