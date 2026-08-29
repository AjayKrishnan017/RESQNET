import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/createIncident.css";
import { createIncident } from "../services/incidentService.js";

function CreateIncident() {

    const navigate = useNavigate();

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

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);
        setMessage("");
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

                peopleAffected: Number(
                    formData.peopleAffected
                ),

                status: formData.status
            };

            // Send incident to backend
            await createIncident(incidentData);

            // Redirect to dashboard
            navigate("/");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create incident"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="create-incident-page">

            <div className="create-incident-container">

                <h1>
                    🚨 Report New Incident
                </h1>

                <p>
                    Create a new disaster incident for the
                    emergency response system.
                </p>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

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
                            placeholder="Example: Flood near Coimbatore"
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
                            placeholder="Describe what is happening..."
                            rows="4"
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
                                placeholder="11.0168"
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
                                placeholder="76.9558"
                                step="any"
                                required
                            />

                        </div>

                    </div>


                    {/* PEOPLE AFFECTED */}

                    <div className="form-group">

                        <label>
                            People Affected
                        </label>

                        <input
                            type="number"
                            name="peopleAffected"
                            value={formData.peopleAffected}
                            onChange={handleChange}
                            placeholder="25"
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


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Incident..."
                            : "🚨 Create Incident"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateIncident;