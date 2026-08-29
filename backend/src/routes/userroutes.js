import express from "express";

import {
    getUsers,
    createUser,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from "../controllers/usercontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


// Everything here is ADMIN only.

router.use(
    protect
);

router.use(
    authorize("ADMIN")
);


router.get(
    "/",
    getUsers
);


router.post(
    "/",
    createUser
);


router.patch(
    "/:id/role",
    updateUserRole
);


router.patch(
    "/:id/status",
    updateUserStatus
);


router.delete(
    "/:id",
    deleteUser
);


export default router;