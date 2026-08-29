import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";

import {
    Server
} from "socket.io";


// ========================================
// DATABASE
// ========================================

import connectDB from "./config/db.js";


// ========================================
// ROUTES
// ========================================

import authRoutes from "./routes/authroutes.js";

import incidentRoutes from "./routes/incidentroutes.js";

import responderRoutes from "./routes/responderroutes.js";

import assignmentRoutes from "./routes/assignmentroutes.js";

import shelterRoutes from "./routes/shelterroutes.js";

import resourceRoutes from "./routes/resourceroutes.js";

import dispatchRoutes from "./routes/dispatchroutes.js";

import decisionRoutes from "./routes/decisionroutes.js";

import geoRoutes from "./routes/georoutes.js";

import userRoutes from "./routes/userroutes.js";

import auditRoutes from "./routes/auditroutes.js";

import notificationRoutes from "./routes/notificationroutes.js";


// ========================================
// MIDDLEWARE
// ========================================

import auditMutationMiddleware
    from "./middleware/auditmiddleware.js";


// ========================================
// ENVIRONMENT VARIABLES
// ========================================

dotenv.config();


// ========================================
// EXPRESS APP
// ========================================

const app =
    express();


// ========================================
// HTTP SERVER
// ========================================
//
// Socket.IO needs a real HTTP server.
// Therefore we use server.listen()
// instead of app.listen().
//

const server =
    http.createServer(
        app
    );


// ========================================
// SOCKET.IO
// ========================================

const io =
    new Server(
        server,
        {
            cors: {

                origin:
                    "http://localhost:5173",

                methods: [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE"
                ],

                credentials:
                    true
            }
        }
    );


// Make Socket.IO available
// inside controllers and middleware.

app.set(
    "io",
    io
);


// ========================================
// SOCKET CONNECTION
// ========================================

io.on(
    "connection",
    (socket) => {

        console.log(
            "🟢 Client connected:",
            socket.id
        );


        // Let frontend know
        // real-time connection is ready.

        socket.emit(
            "connection:ready",
            {
                success: true,

                socketId:
                    socket.id,

                message:
                    "Connected to RESQNET real-time network.",

                timestamp:
                    new Date()
                        .toISOString()
            }
        );


        socket.on(
            "disconnect",
            () => {

                console.log(
                    "🔴 Client disconnected:",
                    socket.id
                );

            }
        );

    }
);


// ========================================
// GLOBAL MIDDLEWARE
// ========================================

app.use(
    cors({
        origin:
            "http://localhost:5173",

        credentials:
            true
    })
);


app.use(
    express.json()
);


app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// REQUEST LOGGER
// ========================================

app.use(
    (req, res, next) => {

        console.log(
            `${req.method} ${req.originalUrl}`
        );

        next();

    }
);


// ========================================
// REAL-TIME SYSTEM UPDATE MIDDLEWARE
// ========================================
//
// After successful data-changing requests,
// tell connected clients that something
// in RESQNET has changed.
//

app.use(
    (req, res, next) => {

        const mutationMethods = [
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ];


        if (
            !mutationMethods.includes(
                req.method
            )
        ) {

            return next();

        }


        const originalJson =
            res.json.bind(res);


        res.json =
            (body) => {

                const statusCode =
                    res.statusCode;


                const result =
                    originalJson(
                        body
                    );


                if (
                    statusCode >= 200 &&
                    statusCode < 400
                ) {

                    io.emit(
                        "system:update",
                        {
                            method:
                                req.method,

                            path:
                                req.originalUrl,

                            statusCode,

                            timestamp:
                                new Date()
                                    .toISOString()
                        }
                    );

                }


                return result;

            };


        next();

    }
);


// ========================================
// AUDIT LOG MIDDLEWARE
// ========================================
//
// Watches successful POST / PUT / PATCH / DELETE
// operations and creates MongoDB audit records
// and notifications.
//

app.use(
    auditMutationMiddleware
);


// ========================================
// HEALTH CHECK
// ========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            service:
                "RESQNET API",

            message:
                "RESQNET emergency response server is running.",

            realtime:
                true,

            timestamp:
                new Date()
                    .toISOString()

        });

    }
);


// ========================================
// API HEALTH CHECK
// ========================================

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            server:
                "ONLINE",

            socket:
                "ONLINE",

            database:
                "CONNECTED",

            timestamp:
                new Date()
                    .toISOString()

        });

    }
);


// ========================================
// AUTHENTICATION
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// USER MANAGEMENT
// ========================================

app.use(
    "/api/users",
    userRoutes
);


// ========================================
// INCIDENT MANAGEMENT
// ========================================

app.use(
    "/api/incidents",
    incidentRoutes
);


// ========================================
// RESPONDER MANAGEMENT
// ========================================

app.use(
    "/api/responders",
    responderRoutes
);


// ========================================
// RESPONDER DEPLOYMENT
// ========================================

app.use(
    "/api/assignments",
    assignmentRoutes
);


// ========================================
// SHELTERS
// ========================================

app.use(
    "/api/shelters",
    shelterRoutes
);


// ========================================
// RESOURCES
// ========================================

app.use(
    "/api/resources",
    resourceRoutes
);


// ========================================
// SMART DISPATCH
// ========================================

app.use(
    "/api/dispatch",
    dispatchRoutes
);


// ========================================
// OPERATIONAL DECISION ENGINE
// ========================================

app.use(
    "/api/decision",
    decisionRoutes
);


// ========================================
// GEOSPATIAL INTELLIGENCE
// ========================================

app.use(
    "/api/geo",
    geoRoutes
);


// ========================================
// AUDIT LOG
// ========================================

app.use(
    "/api/audit",
    auditRoutes
);


// ========================================
// NOTIFICATIONS
// ========================================

app.use(
    "/api/notifications",
    notificationRoutes
);


// ========================================
// 404 API HANDLER
// ========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "🔥 RESQNET SERVER ERROR:",
            error
        );


        if (
            res.headersSent
        ) {

            return next(
                error
            );

        }


        res.status(
            error.status ||
            500
        ).json({

            success: false,

            message:
                error.message ||
                "Internal server error."

        });

    }
);


// ========================================
// PORT
// ========================================

const PORT =
    process.env.PORT ||
    5001;


// ========================================
// START SERVER
// ========================================

const startServer =
    async () => {

        try {

            // Connect MongoDB first.

            await connectDB();


            server.listen(
                PORT,
                () => {

                    console.log(
                        ""
                    );

                    console.log(
                        "=========================================="
                    );

                    console.log(
                        "🚨 RESQNET SERVER ONLINE"
                    );

                    console.log(
                        `🌐 API: http://localhost:${PORT}`
                    );

                    console.log(
                        `📡 Socket.IO: http://localhost:${PORT}`
                    );

                    console.log(
                        "⚡ Socket.IO real-time server is active"
                    );

                    console.log(
                        "🗄️ MongoDB connected successfully"
                    );

                    console.log(
                        "=========================================="
                    );

                    console.log(
                        ""
                    );

                }
            );


        } catch (error) {

            console.error(
                "❌ Failed to start RESQNET:",
                error
            );


            process.exit(
                1
            );

        }

    };


startServer();
