import express from "express";

import {
    createShelter,
    getShelters,
    updateShelter,
    deleteShelter
} from "../controllers/sheltercontrollers.js";

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
// READ
// ========================================

router.get(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER",
        "SHELTER_MANAGER"
    ),
    getShelters
);


// ========================================
// CREATE
// ========================================

router.post(
    "/",
    authorize(
        "ADMIN",
        "DISPATCHER",
        "SHELTER_MANAGER"
    ),
    createShelter
);


// ========================================
// UPDATE
// ========================================

router.put(
    "/:id",
    authorize(
        "ADMIN",
        "DISPATCHER",
        "SHELTER_MANAGER"
    ),
    updateShelter
);


// ========================================
// DELETE
// ========================================

router.delete(
    "/:id",
    authorize(
        "ADMIN",
        "SHELTER_MANAGER"
    ),
    deleteShelter
);


export default router;