import express from "express";

import {
    getDispatchRecommendations
} from "../controllers/dispatchcontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


router.get(
    "/recommendations/:incidentId",

    protect,

    authorize(
        "ADMIN",
        "DISPATCHER"
    ),

    getDispatchRecommendations
);


export default router;