import express from "express";

import {
    createResponder,
    getResponders,
    getResponderById,
    updateResponder,
    deleteResponder
} from "../controllers/respondercontrollers.js";

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
// READ RESPONDERS
// ========================================

router.get(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    getResponders
);


router.get(
    "/:id",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    getResponderById
);


// ========================================
// CREATE
// ========================================

router.post(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    createResponder
);


// ========================================
// UPDATE
// ========================================

router.put(
    "/:id",
    authorize(
        "ADMIN",
        "DISPATCHER"
    ),
    updateResponder
);


// ========================================
// DELETE
// ========================================

router.delete(
    "/:id",
    authorize(
        "ADMIN"
    ),
    deleteResponder
);


export default router;