import {
    useEffect,
    useState
} from "react";

import "../css/auditLogs.css";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import {
    getAuditLogs
} from "../services/auditService.js";


function AuditLogs() {

    const [
        logs,
        setLogs
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        action,
        setAction
    ] = useState("");


    const [
        entityType,
        setEntityType
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const loadLogs =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getAuditLogs({

                        limit: 50,

                        search:
                            search ||
                            undefined,

                        action:
                            action ||
                            undefined,

                        entityType:
                            entityType ||
                            undefined

                    });


                setLogs(

                    Array.isArray(
                        data?.logs
                    )
                        ? data.logs
                        : []

                );


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to load audit logs."

                );


            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadLogs();

    }, []);


    const handleSubmit =
        (event) => {

            event.preventDefault();

            loadLogs();

        };


    return (

        <div className="dashboard">

            <Navbar />


            <div className="dashboard-layout">

                <Sidebar />


                <main className="main-content">


                    <div className="audit-header">

                        <div>

                            <h1>
                                📋 Audit Log
                            </h1>

                            <p>
                                Operational activity and
                                security history across RESQNET.
                            </p>

                        </div>

                    </div>


                    <form
                        className="audit-filters"

                        onSubmit={
                            handleSubmit
                        }
                    >

                        <input
                            placeholder="Search actor or activity..."

                            value={
                                search
                            }

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />


                        <select
                            value={
                                action
                            }

                            onChange={(event) =>
                                setAction(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Actions
                            </option>

                            <option value="CREATE">
                                Create
                            </option>

                            <option value="UPDATE">
                                Update
                            </option>

                            <option value="DELETE">
                                Delete
                            </option>

                            <option value="DEPLOY">
                                Deploy
                            </option>

                            <option value="RELEASE">
                                Release
                            </option>

                        </select>


                        <select
                            value={
                                entityType
                            }

                            onChange={(event) =>
                                setEntityType(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Modules
                            </option>

                            <option value="INCIDENT">
                                Incidents
                            </option>

                            <option value="RESPONDER">
                                Responders
                            </option>

                            <option value="DEPLOYMENT">
                                Deployments
                            </option>

                            <option value="SHELTER">
                                Shelters
                            </option>

                            <option value="RESOURCE">
                                Resources
                            </option>

                            <option value="USER">
                                Users
                            </option>

                        </select>


                        <button type="submit">

                            Search

                        </button>

                    </form>


                    {
                        error && (

                            <div className="audit-error">

                                {error}

                            </div>

                        )
                    }


                    {
                        loading ? (

                            <div className="audit-empty">

                                Loading activity...

                            </div>

                        ) : logs.length ===
                        0 ? (

                            <div className="audit-empty">

                                No activity found.

                            </div>

                        ) : (

                            <div className="audit-table-wrapper">

                                <table className="audit-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                User
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                            <th>
                                                Module
                                            </th>

                                            <th>
                                                Activity
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            logs.map(
                                                (log) => (

                                                    <tr
                                                        key={
                                                            log._id
                                                        }
                                                    >

                                                        <td>

                                                            {
                                                                new Date(
                                                                    log.createdAt
                                                                ).toLocaleString()
                                                            }

                                                        </td>


                                                        <td>

                                                            <strong>

                                                                {
                                                                    log.actorName
                                                                }

                                                            </strong>

                                                            <small>

                                                                {
                                                                    log.actorRole
                                                                }

                                                            </small>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={`audit-action ${log.action?.toLowerCase()}`}
                                                            >

                                                                {
                                                                    log.action
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                log.entityType
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                log.description
                                                            }

                                                        </td>

                                                    </tr>

                                                )
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


export default AuditLogs;