import express from "express";

import {
    getDecisionAnalysis
} from "../controllers/decisioncontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


router.get(
    "/:incidentId",

    protect,

    authorize(
        "ADMIN",
        "DISPATCHER"
    ),

    getDecisionAnalysis
);


export default router;