import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./css/layout.css";

import {
    AuthProvider,
    useAuth
} from "./context/AuthContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotificationCenter from "./components/NotificationCenter.jsx";

import Login from "./pages/Login.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import CommandCenter from "./pages/CommandCenter.jsx";

import Incidents from "./pages/Incidents.jsx";
import CreateIncident from "./pages/CreateIncident.jsx";
import IncidentDetails from "./pages/IncidentDetails.jsx";
import EditIncident from "./pages/EditIncident.jsx";

import Responders from "./pages/Responders.jsx";
import CreateResponder from "./pages/CreateResponder.jsx";
import EditResponder from "./pages/EditResponder.jsx";

import Shelters from "./pages/Shelters.jsx";
import Resources from "./pages/Resources.jsx";

import Users from "./pages/Users.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";


function GlobalNotifications() {

    const {
        isAuthenticated
    } = useAuth();


    if (!isAuthenticated) {

        return null;

    }


    return (
        <NotificationCenter />
    );

}


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <GlobalNotifications />


                <Routes>


                    <Route
                        path="/login"

                        element={
                            <Login />
                        }
                    />


                    <Route
                        path="/"

                        element={

                            <ProtectedRoute>

                                <Dashboard />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/command-center"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <CommandCenter />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/incidents"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER",
                                    "RESPONDER"
                                ]}
                            >

                                <Incidents />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/create-incident"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <CreateIncident />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/incidents/:id"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER",
                                    "RESPONDER"
                                ]}
                            >

                                <IncidentDetails />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/incidents/:id/edit"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <EditIncident />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/responders"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <Responders />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/responders/create"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <CreateResponder />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/responders/:id/edit"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER"
                                ]}
                            >

                                <EditResponder />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/shelters"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER",
                                    "SHELTER_MANAGER"
                                ]}
                            >

                                <Shelters />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/resources"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "DISPATCHER",
                                    "SHELTER_MANAGER"
                                ]}
                            >

                                <Resources />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/users"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN"
                                ]}
                            >

                                <Users />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/audit-logs"

                        element={

                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN"
                                ]}
                            >

                                <AuditLogs />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="*"

                        element={

                            <Navigate
                                to="/"
                                replace
                            />

                        }
                    />


                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

}


export default App;

