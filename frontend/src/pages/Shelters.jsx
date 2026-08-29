import {
    useEffect,
    useState
} from "react";

import "../css/operations.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getShelters,
    createShelter,
    deleteShelter
} from "../services/shelterService.js";


function Shelters() {

    const [shelters, setShelters] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);


    const [formData, setFormData] =
        useState({
            name: "",
            capacity: "",
            occupied: "0",
            latitude: "",
            longitude: "",
            contactNumber: ""
        });


    const fetchShelters =
        async () => {

            try {

                setLoading(true);

                const data =
                    await getShelters();

                setShelters(
                    Array.isArray(
                        data?.shelters
                    )
                        ? data.shelters
                        : []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load shelters."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {
        fetchShelters();
    }, []);


    const handleChange = (event) => {

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

            try {

                await createShelter({
                    name:
                        formData.name,

                    capacity:
                        Number(
                            formData.capacity
                        ),

                    occupied:
                        Number(
                            formData.occupied
                        ),

                    location: {
                        latitude:
                            Number(
                                formData.latitude
                            ),

                        longitude:
                            Number(
                                formData.longitude
                            )
                    },

                    contactNumber:
                        formData.contactNumber
                });


                setFormData({
                    name: "",
                    capacity: "",
                    occupied: "0",
                    latitude: "",
                    longitude: "",
                    contactNumber: ""
                });


                setShowForm(false);

                fetchShelters();

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to create shelter."
                );

            }

        };


    const handleDelete =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this shelter?"
                )
            ) {
                return;
            }

            await deleteShelter(id);

            setShelters(
                (previous) =>
                    previous.filter(
                        (shelter) =>
                            shelter._id !== id
                    )
            );

        };


    return (

        <div className="dashboard">

            <Navbar />

            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">

                    <div className="operations-header">

                        <div>

                            <h1>
                                🏥 Shelter Management
                            </h1>

                            <p>
                                Track emergency shelters
                                and evacuation capacity.
                            </p>

                        </div>


                        <button
                            className="operation-primary-button"

                            onClick={() =>
                                setShowForm(
                                    !showForm
                                )
                            }
                        >

                            {
                                showForm
                                    ? "Close"
                                    : "+ Add Shelter"
                            }

                        </button>

                    </div>


                    <div className="operation-stats">

                        <div>
                            <span>
                                Total Shelters
                            </span>

                            <strong>
                                {shelters.length}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Total Capacity
                            </span>

                            <strong>

                                {
                                    shelters.reduce(
                                        (
                                            total,
                                            shelter
                                        ) =>
                                            total +
                                            (
                                                shelter.capacity ||
                                                0
                                            ),

                                        0
                                    )
                                }

                            </strong>
                        </div>


                        <div>
                            <span>
                                People Sheltered
                            </span>

                            <strong>

                                {
                                    shelters.reduce(
                                        (
                                            total,
                                            shelter
                                        ) =>
                                            total +
                                            (
                                                shelter.occupied ||
                                                0
                                            ),

                                        0
                                    )
                                }

                            </strong>
                        </div>

                    </div>


                    {showForm && (

                        <form
                            className="operation-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <input
                                name="name"
                                placeholder="Shelter name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                type="number"
                                name="capacity"
                                placeholder="Capacity"
                                value={
                                    formData.capacity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                type="number"
                                name="occupied"
                                placeholder="Occupied"
                                value={
                                    formData.occupied
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                placeholder="Latitude"
                                value={
                                    formData.latitude
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                placeholder="Longitude"
                                value={
                                    formData.longitude
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="contactNumber"
                                placeholder="Contact number"
                                value={
                                    formData.contactNumber
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <button
                                type="submit"
                                className="operation-primary-button"
                            >
                                Create Shelter
                            </button>

                        </form>

                    )}


                    {error && (
                        <div className="operation-error">
                            {error}
                        </div>
                    )}


                    {loading ? (

                        <div className="operation-empty">
                            Loading shelters...
                        </div>

                    ) : (

                        <div className="operation-grid">

                            {
                                shelters.map(
                                    (shelter) => {

                                        const occupancy =
                                            shelter.capacity >
                                            0
                                                ? Math.round(
                                                    (
                                                        shelter.occupied /
                                                        shelter.capacity
                                                    ) *
                                                    100
                                                )
                                                : 0;


                                        return (

                                            <div
                                                className="operation-card"

                                                key={
                                                    shelter._id
                                                }
                                            >

                                                <h2>
                                                    🏥{" "}
                                                    {
                                                        shelter.name
                                                    }
                                                </h2>

                                                <p>
                                                    Capacity:{" "}
                                                    <strong>
                                                        {
                                                            shelter.capacity
                                                        }
                                                    </strong>
                                                </p>

                                                <p>
                                                    Occupied:{" "}
                                                    <strong>
                                                        {
                                                            shelter.occupied
                                                        }
                                                    </strong>
                                                </p>


                                                <div className="capacity-bar">

                                                    <div
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    occupancy,
                                                                    100
                                                                )}%`
                                                        }}
                                                    />

                                                </div>


                                                <span className="operation-muted">
                                                    {occupancy}% occupied
                                                </span>


                                                <p>
                                                    📍{" "}
                                                    {
                                                        shelter.location
                                                            ?.latitude
                                                    }

                                                    ,{" "}

                                                    {
                                                        shelter.location
                                                            ?.longitude
                                                    }
                                                </p>


                                                <button
                                                    className="operation-delete-button"

                                                    onClick={() =>
                                                        handleDelete(
                                                            shelter._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}


export default Shelters;