import express from "express";

import {
    getIncidentGeoIntelligence
} from "../controllers/geocontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router = express.Router();


router.get(
    "/incident/:incidentId",

    protect,

    authorize(
        "ADMIN",
        "DISPATCHER"
    ),

    getIncidentGeoIntelligence
);


export default router;