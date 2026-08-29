import express from "express";

import {
    assignResponder,
    releaseResponder
} from "../controllers/assignmentcontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


router.use(
    protect
);


// ========================================
// DEPLOY RESPONDER
// ========================================

router.post(
    "/assign",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    assignResponder
);


// ========================================
// RELEASE RESPONDER
// ========================================

router.post(
    "/release",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    releaseResponder
);


export default router;