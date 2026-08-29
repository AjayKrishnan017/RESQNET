import express from "express";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../controllers/notificationcontrollers.js";

import {
    protect
} from "../middleware/authmiddleware.js";


const router =
    express.Router();


router.use(
    protect
);


router.get(
    "/",
    getNotifications
);


router.patch(
    "/read-all",
    markAllNotificationsRead
);


router.patch(
    "/:id/read",
    markNotificationRead
);


export default router;