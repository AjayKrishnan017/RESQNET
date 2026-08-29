import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/incidents`;


// ========================================
// GET INCIDENTS
// ========================================

export const getIncidents =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// GET INCIDENT
// ========================================

export const getIncidentById =
    async (id) => {

        const response =
            await axios.get(
                `${API_URL}/${id}`
            );


        return response.data;

    };


// ========================================
// CREATE INCIDENT
// ========================================

export const createIncident =
    async (incidentData) => {

        const response =
            await axios.post(
                API_URL,
                incidentData
            );


        return response.data;

    };


// ========================================
// UPDATE INCIDENT
// ========================================

export const updateIncident =
    async (
        id,
        incidentData
    ) => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                incidentData
            );


        return response.data;

    };


// ========================================
// DELETE INCIDENT
// ========================================

export const deleteIncident =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );


        return response.data;

    };