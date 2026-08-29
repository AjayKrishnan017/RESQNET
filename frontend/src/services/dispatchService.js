import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/dispatch`;


// ========================================
// SMART DISPATCH RECOMMENDATIONS
// ========================================

export const getDispatchRecommendations =
    async (incidentId) => {

        const response =
            await axios.get(
                `${API_URL}/recommendations/${incidentId}`
            );


        return response.data;

    };