import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import "../css/responderForm.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getResponderById,
    updateResponder
} from "../services/responderService.js";


function EditResponder() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const [formData, setFormData] =
        useState({

            name: "",

            teamName: "",

            role: "SEARCH_RESCUE",

            skills: "",

            status: "AVAILABLE",

            latitude: "",

            longitude: ""

        });


    useEffect(() => {

        const loadResponder =
            async () => {

                try {

                    const data =
                        await getResponderById(
                            id
                        );


                    const responder =
                        data?.responder ||
                        data;


                    setFormData({

                        name:
                            responder.name ||
                            "",

                        teamName:
                            responder.teamName ||
                            "",

                        role:
                            responder.role ||
                            "SEARCH_RESCUE",

                        skills:
                            responder.skills
                                ?.join(", ") ||
                            "",

                        status:
                            responder.status ||
                            "AVAILABLE",

                        latitude:
                            responder.location
                                ?.latitude ??
                            "",

                        longitude:
                            responder.location
                                ?.longitude ??
                            ""

                    });

                } catch (error) {

                    console.error(error);

                    setError(
                        "Failed to load responder."
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadResponder();

    }, [id]);


    const handleChange =
        (event) => {

            const {
                name,
                value
            } = event.target;


            setFormData(
                (previous) => ({
                    ...previous,
                    [name]: value
                })
            );

        };


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setSaving(true);

            setError("");


            try {

                const responderData = {

                    name:
                        formData.name,

                    teamName:
                        formData.teamName,

                    role:
                        formData.role,

                    skills:
                        formData.skills
                            .split(",")
                            .map(
                                (skill) =>
                                    skill.trim()
                            )
                            .filter(Boolean),

                    status:
                        formData.status,

                    location: {

                        latitude:
                            formData.latitude === ""
                                ? undefined
                                : Number(
                                    formData.latitude
                                ),

                        longitude:
                            formData.longitude === ""
                                ? undefined
                                : Number(
                                    formData.longitude
                                )

                    }

                };


                await updateResponder(
                    id,
                    responderData
                );


                navigate(
                    "/responders"
                );

            } catch (error) {

                console.error(error);

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Failed to update responder."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (

            <div className="dashboard">

                <Navbar />

                <div className="dashboard-layout">

                    <Sidebar />

                    <main className="main-content">

                        Loading responder...

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


                    <div className="responder-form-container">


                        <div className="responder-form-header">

                            <h1>
                                ✏️ Edit Responder
                            </h1>

                            <p>
                                Update responder details
                                and availability.
                            </p>

                        </div>


                        {error && (

                            <div className="responder-form-error">

                                {error}

                            </div>

                        )}


                        <form
                            className="responder-form"

                            onSubmit={
                                handleSubmit
                            }
                        >


                            <div className="responder-form-group">

                                <label>
                                    Responder Name
                                </label>

                                <input
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="responder-form-group">

                                <label>
                                    Team Name
                                </label>

                                <input
                                    name="teamName"
                                    value={
                                        formData.teamName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="responder-form-grid">


                                <div className="responder-form-group">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="MEDICAL">
                                            Medical
                                        </option>

                                        <option value="FIRE_RESCUE">
                                            Fire Rescue
                                        </option>

                                        <option value="POLICE">
                                            Police
                                        </option>

                                        <option value="SEARCH_RESCUE">
                                            Search & Rescue
                                        </option>

                                        <option value="DRONE_OPERATOR">
                                            Drone Operator
                                        </option>

                                        <option value="VOLUNTEER">
                                            Volunteer
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                <div className="responder-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="AVAILABLE">
                                            Available
                                        </option>

                                        <option value="DEPLOYED">
                                            Deployed
                                        </option>

                                        <option value="OFF_DUTY">
                                            Off Duty
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="responder-form-group">

                                <label>
                                    Skills
                                </label>

                                <input
                                    name="skills"
                                    value={
                                        formData.skills
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="responder-form-grid">


                                <div className="responder-form-group">

                                    <label>
                                        Latitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={
                                            formData.latitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="responder-form-group">

                                    <label>
                                        Longitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={
                                            formData.longitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                            </div>


                            <div className="responder-form-actions">


                                <button
                                    type="button"
                                    className="responder-cancel"
                                    onClick={() =>
                                        navigate(
                                            "/responders"
                                        )
                                    }
                                >

                                    ← Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="responder-save"
                                    disabled={
                                        saving
                                    }
                                >

                                    {
                                        saving
                                            ? "Saving..."
                                            : "Save Changes"
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


export default EditResponder;