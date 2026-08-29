import {
    useEffect,
    useState
} from "react";

import "../css/operations.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getResources,
    createResource,
    deleteResource
} from "../services/resourceService.js";


function Resources() {

    const [resources, setResources] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showForm, setShowForm] =
        useState(false);


    const [formData, setFormData] =
        useState({
            name: "",
            category: "FOOD",
            quantity: "",
            unit: "units"
        });


    const fetchResources =
        async () => {

            try {

                setLoading(true);

                const data =
                    await getResources();

                setResources(
                    Array.isArray(
                        data?.resources
                    )
                        ? data.resources
                        : []
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {
        fetchResources();
    }, []);


    const handleChange =
        (event) => {

            setFormData(
                (previous) => ({
                    ...previous,
                    [event.target.name]:
                        event.target.value
                })
            );

        };


    const handleSubmit =
        async (event) => {

            event.preventDefault();


            const quantity =
                Number(
                    formData.quantity
                );


            let status =
                "AVAILABLE";


            if (quantity === 0) {

                status =
                    "OUT_OF_STOCK";

            } else if (
                quantity <= 10
            ) {

                status =
                    "LOW_STOCK";

            }


            await createResource({
                ...formData,
                quantity,
                status
            });


            setFormData({
                name: "",
                category: "FOOD",
                quantity: "",
                unit: "units"
            });


            setShowForm(false);

            fetchResources();

        };


    const handleDelete =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this resource?"
                )
            ) {
                return;
            }


            await deleteResource(id);


            setResources(
                (previous) =>
                    previous.filter(
                        (resource) =>
                            resource._id !== id
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
                                📦 Resource Management
                            </h1>

                            <p>
                                Track emergency supplies
                                and disaster inventory.
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
                                    : "+ Add Resource"
                            }

                        </button>

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
                                placeholder="Resource name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="FOOD">
                                    Food
                                </option>

                                <option value="WATER">
                                    Water
                                </option>

                                <option value="MEDICAL">
                                    Medical
                                </option>

                                <option value="EQUIPMENT">
                                    Equipment
                                </option>

                                <option value="CLOTHING">
                                    Clothing
                                </option>

                                <option value="FUEL">
                                    Fuel
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>


                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                min="0"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <input
                                name="unit"
                                placeholder="Unit"
                                value={
                                    formData.unit
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            <button
                                type="submit"
                                className="operation-primary-button"
                            >
                                Add Resource
                            </button>

                        </form>

                    )}


                    {loading ? (

                        <div className="operation-empty">
                            Loading resources...
                        </div>

                    ) : (

                        <div className="operation-grid">

                            {
                                resources.map(
                                    (resource) => (

                                        <div
                                            className="operation-card"
                                            key={
                                                resource._id
                                            }
                                        >

                                            <h2>
                                                📦{" "}
                                                {
                                                    resource.name
                                                }
                                            </h2>


                                            <p>
                                                Category:{" "}
                                                <strong>
                                                    {
                                                        resource.category
                                                    }
                                                </strong>
                                            </p>


                                            <p>
                                                Stock:{" "}

                                                <strong>
                                                    {
                                                        resource.quantity
                                                    }{" "}
                                                    {
                                                        resource.unit
                                                    }
                                                </strong>
                                            </p>


                                            <span
                                                className={`resource-status ${
                                                    resource.status
                                                        ?.toLowerCase()
                                                }`}
                                            >
                                                {
                                                    resource.status
                                                        ?.replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                }
                                            </span>


                                            <button
                                                className="operation-delete-button"

                                                onClick={() =>
                                                    handleDelete(
                                                        resource._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}


export default Resources;