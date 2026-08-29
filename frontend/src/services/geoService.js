import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/geo`;


// ========================================
// GEO INTELLIGENCE
// ========================================

export const getIncidentGeoIntelligence =
    async (
        incidentId,
        radius = 50
    ) => {

        const response =
            await axios.get(
                `${API_URL}/incident/${incidentId}`,
                {
                    params: {
                        radius
                    }
                }
            );


        return response.data;

    };