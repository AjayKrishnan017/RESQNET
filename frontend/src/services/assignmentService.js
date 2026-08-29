import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/assignments`;


// ========================================
// ASSIGN RESPONDER
// ========================================

export const assignResponder =
    async (
        incidentId,
        responderId
    ) => {

        const response =
            await axios.post(
                `${API_URL}/assign`,
                {
                    incidentId,
                    responderId
                }
            );


        return response.data;

    };


// ========================================
// RELEASE RESPONDER
// ========================================

export const releaseResponder =
    async (responderId) => {

        const response =
            await axios.post(
                `${API_URL}/release`,
                {
                    responderId
                }
            );


        return response.data;

    };