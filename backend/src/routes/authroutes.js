import express from "express";

import {
    register,
    login,
    getCurrentUser
} from "../controllers/authcontrollers.js";

import {
    protect,
    authorize
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


// ========================================
// PUBLIC LOGIN
// ========================================

router.post(
    "/login",
    login
);


// ========================================
// CURRENT USER
// ========================================

router.get(
    "/me",
    protect,
    getCurrentUser
);


// ========================================
// ADMIN CREATES USERS
// ========================================
//
// Registration is no longer public.
// This prevents somebody from registering
// themselves as ADMIN.
//

router.post(
    "/register",
    protect,
    authorize("ADMIN"),
    register
);


export default router;