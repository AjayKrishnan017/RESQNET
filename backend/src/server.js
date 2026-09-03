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
// ALLOWED FRONTEND ORIGINS
// ========================================
//
// Local:
// http://localhost:5173
//
// Production:
// https://your-vercel-site.vercel.app
//
// Render reads these from:
//
// FRONTEND_URLS=
// http://localhost:5173,https://your-site.vercel.app
//

const allowedOrigins =
    (
        process.env.FRONTEND_URLS ||
        "http://localhost:5173"
    )
        .split(",")
        .map(
            (origin) =>
                origin.trim()
        )
        .filter(Boolean);


console.log(
    "🌐 Allowed frontend origins:",
    allowedOrigins
);


// ========================================
// EXPRESS APP
// ========================================

const app =
    express();


// ========================================
// HTTP SERVER
// ========================================

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

                origin: (
                    origin,
                    callback
                ) => {

                    // Some non-browser clients
                    // may not send an Origin header.

                    if (!origin) {

                        return callback(
                            null,
                            true
                        );

                    }


                    if (
                        allowedOrigins.includes(
                            origin
                        )
                    ) {

                        return callback(
                            null,
                            true
                        );

                    }


                    console.log(
                        "🚫 Socket.IO CORS blocked:",
                        origin
                    );


                    return callback(
                        new Error(
                            "Socket.IO origin not allowed."
                        )
                    );

                },

                methods: [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE"
                ],

                credentials: true
            }
        }
    );


// Make Socket.IO available
// throughout the Express app.

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
// EXPRESS CORS
// ========================================

app.use(
    cors({
        origin: (
            origin,
            callback
        ) => {

            // Requests such as Postman,
            // curl or server-to-server
            // might not send Origin.

            if (!origin) {

                return callback(
                    null,
                    true
                );

            }


            if (
                allowedOrigins.includes(
                    origin
                )
            ) {

                return callback(
                    null,
                    true
                );

            }


            console.log(
                "🚫 Express CORS blocked:",
                origin
            );


            return callback(
                new Error(
                    "Origin not allowed by CORS."
                )
            );

        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ========================================
// BODY PARSERS
// ========================================

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

            allowedOrigins,

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
// RESPONDER ASSIGNMENTS
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
// 404 HANDLER
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

            await connectDB();


            server.listen(
                PORT,
                "0.0.0.0",
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
                        `🌐 PORT: ${PORT}`
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
