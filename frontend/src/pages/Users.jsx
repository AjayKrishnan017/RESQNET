import {
    useEffect,
    useState
} from "react";

import "../css/users.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    useAuth
} from "../context/AuthContext.jsx";

import {
    getUsers,
    createUser,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from "../services/userService.js";


function Users() {

    const {
        user: currentUser
    } = useAuth();


    const [
        users,
        setUsers
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        message,
        setMessage
    ] = useState("");


    const [
        showForm,
        setShowForm
    ] = useState(false);


    const [
        workingId,
        setWorkingId
    ] = useState(null);


    const [
        formData,
        setFormData
    ] = useState({

        name: "",

        email: "",

        password: "",

        role: "DISPATCHER"

    });


    // ========================================
    // LOAD USERS
    // ========================================

    const loadUsers =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getUsers();


                setUsers(

                    Array.isArray(
                        data?.users
                    )
                        ? data.users
                        : []

                );

            } catch (error) {

                console.error(
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to load users."

                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadUsers();

    }, []);


    // ========================================
    // FORM
    // ========================================

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


    const handleCreate =
        async (event) => {

            event.preventDefault();


            try {

                setError("");

                setMessage("");


                await createUser(
                    formData
                );


                setMessage(
                    "User created successfully."
                );


                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "DISPATCHER"
                });


                setShowForm(
                    false
                );


                await loadUsers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to create user."

                );

            }

        };


    // ========================================
    // ROLE
    // ========================================

    const handleRoleChange =
        async (
            id,
            role
        ) => {

            try {

                setWorkingId(
                    id
                );

                setError("");


                await updateUserRole(
                    id,
                    role
                );


                await loadUsers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Unable to update role."

                );


            } finally {

                setWorkingId(
                    null
                );

            }

        };


    // ========================================
    // ENABLE / DISABLE
    // ========================================

    const handleStatus =
        async (
            id,
            currentStatus
        ) => {

            try {

                setWorkingId(
                    id
                );


                await updateUserStatus(
                    id,
                    !currentStatus
                );


                await loadUsers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Unable to update user."

                );


            } finally {

                setWorkingId(
                    null
                );

            }

        };


    // ========================================
    // DELETE
    // ========================================

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Delete this user account?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setWorkingId(
                    id
                );


                await deleteUser(
                    id
                );


                await loadUsers();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Unable to delete user."

                );


            } finally {

                setWorkingId(
                    null
                );

            }

        };


    // ========================================
    // STATS
    // ========================================

    const activeUsers =
        users.filter(
            (user) =>
                user.isActive
        );


    const admins =
        users.filter(
            (user) =>
                user.role ===
                "ADMIN"
        );


    const dispatchers =
        users.filter(
            (user) =>
                user.role ===
                "DISPATCHER"
        );


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    <div className="users-header">


                        <div>

                            <h1>
                                👥 User Management
                            </h1>


                            <p>
                                Manage RESQNET staff accounts,
                                permissions and access.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="users-primary-button"

                            onClick={() =>
                                setShowForm(
                                    (previous) =>
                                        !previous
                                )
                            }
                        >

                            {
                                showForm
                                    ? "Close"
                                    : "+ Create User"
                            }

                        </button>

                    </div>


                    {/* ========================================
                        STATS
                    ======================================== */}

                    <div className="users-stats">


                        <div>

                            <span>
                                Total Users
                            </span>

                            <strong>
                                {users.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Active
                            </span>

                            <strong>
                                {
                                    activeUsers.length
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Admins
                            </span>

                            <strong>
                                {
                                    admins.length
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Dispatchers
                            </span>

                            <strong>
                                {
                                    dispatchers.length
                                }
                            </strong>

                        </div>


                    </div>


                    {/* ========================================
                        CREATE USER
                    ======================================== */}

                    {
                        showForm && (

                            <form
                                className="users-create-form"
                                onSubmit={
                                    handleCreate
                                }
                            >


                                <input
                                    name="name"
                                    placeholder="Full name"

                                    value={
                                        formData.name
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required
                                />


                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"

                                    value={
                                        formData.email
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required
                                />


                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Temporary password"

                                    value={
                                        formData.password
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    minLength="6"

                                    required
                                />


                                <select
                                    name="role"

                                    value={
                                        formData.role
                                    }

                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                    <option value="DISPATCHER">
                                        Dispatcher
                                    </option>

                                    <option value="RESPONDER">
                                        Responder
                                    </option>

                                    <option value="SHELTER_MANAGER">
                                        Shelter Manager
                                    </option>

                                </select>


                                <button
                                    type="submit"
                                    className="users-primary-button"
                                >

                                    Create Account

                                </button>


                            </form>

                        )
                    }


                    {error && (

                        <div className="users-error">

                            {error}

                        </div>

                    )}


                    {message && (

                        <div className="users-success">

                            {message}

                        </div>

                    )}


                    {/* ========================================
                        USER LIST
                    ======================================== */}

                    {
                        loading ? (

                            <div className="users-empty">

                                Loading users...

                            </div>

                        ) : (

                            <div className="users-table-wrapper">


                                <table className="users-table">


                                    <thead>

                                        <tr>

                                            <th>
                                                User
                                            </th>

                                            <th>
                                                Role
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Created
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>


                                        {
                                            users.map(
                                                (user) => {

                                                    const isSelf =
                                                        user._id ===
                                                        currentUser?._id;


                                                    return (

                                                        <tr
                                                            key={
                                                                user._id
                                                            }
                                                        >


                                                            <td>

                                                                <div className="users-identity">


                                                                    <span className="users-avatar">

                                                                        👤

                                                                    </span>


                                                                    <div>

                                                                        <strong>

                                                                            {
                                                                                user.name
                                                                            }

                                                                            {
                                                                                isSelf &&
                                                                                " (You)"
                                                                            }

                                                                        </strong>


                                                                        <span>

                                                                            {
                                                                                user.email
                                                                            }

                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <select
                                                                    value={
                                                                        user.role
                                                                    }

                                                                    disabled={
                                                                        workingId ===
                                                                        user._id
                                                                    }

                                                                    onChange={(event) =>
                                                                        handleRoleChange(
                                                                            user._id,
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                >

                                                                    <option value="ADMIN">
                                                                        ADMIN
                                                                    </option>

                                                                    <option value="DISPATCHER">
                                                                        DISPATCHER
                                                                    </option>

                                                                    <option value="RESPONDER">
                                                                        RESPONDER
                                                                    </option>

                                                                    <option value="SHELTER_MANAGER">
                                                                        SHELTER MANAGER
                                                                    </option>

                                                                </select>

                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={
                                                                        user.isActive
                                                                            ? "user-status active"
                                                                            : "user-status disabled"
                                                                    }
                                                                >

                                                                    {
                                                                        user.isActive
                                                                            ? "ACTIVE"
                                                                            : "DISABLED"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                {
                                                                    user.createdAt
                                                                        ? new Date(
                                                                            user.createdAt
                                                                        ).toLocaleDateString()
                                                                        : "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                <div className="user-actions">


                                                                    <button
                                                                        type="button"

                                                                        disabled={
                                                                            isSelf ||
                                                                            workingId ===
                                                                            user._id
                                                                        }

                                                                        onClick={() =>
                                                                            handleStatus(
                                                                                user._id,
                                                                                user.isActive
                                                                            )
                                                                        }
                                                                    >

                                                                        {
                                                                            user.isActive
                                                                                ? "Disable"
                                                                                : "Enable"
                                                                        }

                                                                    </button>


                                                                    <button
                                                                        type="button"

                                                                        className="user-delete"

                                                                        disabled={
                                                                            isSelf ||
                                                                            workingId ===
                                                                            user._id
                                                                        }

                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                user._id
                                                                            )
                                                                        }
                                                                    >

                                                                        Delete

                                                                    </button>


                                                                </div>

                                                            </td>


                                                        </tr>

                                                    );

                                                }
                                            )
                                        }


                                    </tbody>


                                </table>


                            </div>

                        )
                    }


                </main>

            </div>

        </div>

    );

}


export default Users;