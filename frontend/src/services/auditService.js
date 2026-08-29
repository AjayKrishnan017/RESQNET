import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/audit`;


// ========================================
// GET AUDIT LOGS
// ========================================

export const getAuditLogs =
    async (
        params = {}
    ) => {

        const response =
            await axios.get(
                API_URL,
                {
                    params
                }
            );


        return response.data;

    };