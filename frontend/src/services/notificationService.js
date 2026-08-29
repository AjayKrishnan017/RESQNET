import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/notifications`;


// ========================================
// GET NOTIFICATIONS
// ========================================

export const getNotifications =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// MARK ONE READ
// ========================================

export const markNotificationRead =
    async (id) => {

        const response =
            await axios.patch(
                `${API_URL}/${id}/read`
            );


        return response.data;

    };


// ========================================
// MARK ALL READ
// ========================================

export const markAllNotificationsRead =
    async () => {

        const response =
            await axios.patch(
                `${API_URL}/read-all`
            );


        return response.data;

    };