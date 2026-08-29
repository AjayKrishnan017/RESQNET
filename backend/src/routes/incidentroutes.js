import express from "express";

import {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident
} from "../controllers/incidentcontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


// Everything below requires login.

router.use(
    protect
);


// ========================================
// READ INCIDENTS
// ========================================
//
// All operational roles can view incidents.
//

router.get(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER",
        "RESPONDER",
        "SHELTER_MANAGER"
    ),
    getIncidents
);


router.get(
    "/:id",
    authorize(
        "ADMIN",
        "DISPATCHER",
        "RESPONDER",
        "SHELTER_MANAGER"
    ),
    getIncidentById
);


// ========================================
// CREATE INCIDENT
// ========================================

router.post(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    createIncident
);


// ========================================
// UPDATE INCIDENT
// ========================================

router.put(
    "/:id",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    updateIncident
);


// ========================================
// DELETE INCIDENT
// ========================================

router.delete(
    "/:id",
    authorize(
        "ADMIN"
    ),
    deleteIncident
);


export default router;