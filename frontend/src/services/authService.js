import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/auth`;


// ========================================
// LOGIN
// ========================================

export const loginUser =
    async (
        email,
        password
    ) => {

        const response =
            await axios.post(
                `${API_URL}/login`,
                {
                    email,
                    password
                }
            );


        return response.data;

    };


// ========================================
// CURRENT USER
// ========================================

export const getCurrentUser =
    async () => {

        const response =
            await axios.get(
                `${API_URL}/me`
            );


        return response.data;

    };