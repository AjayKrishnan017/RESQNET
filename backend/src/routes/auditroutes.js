import express from "express";

import {
    getAuditLogs
} from "../controllers/auditcontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


router.get(
    "/",

    protect,

    authorize(
        "ADMIN"
    ),

    getAuditLogs
);


export default router;