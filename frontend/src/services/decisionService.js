import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/decision`;


// ========================================
// OPERATIONAL DECISION ANALYSIS
// ========================================

export const getDecisionAnalysis =
    async (incidentId) => {

        const response =
            await axios.get(
                `${API_URL}/${incidentId}`
            );


        return response.data;

    };