import express from "express";

import {
    createResource,
    getResources,
    updateResource,
    deleteResource
} from "../controllers/resourcecontrollers.js";

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
    getResources
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
    createResource
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
    updateResource
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
    deleteResource
);


export default router;