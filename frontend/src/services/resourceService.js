import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/resources`;


// ========================================
// GET RESOURCES
// ========================================

export const getResources =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// CREATE RESOURCE
// ========================================

export const createResource =
    async (resourceData) => {

        const response =
            await axios.post(
                API_URL,
                resourceData
            );


        return response.data;

    };


// ========================================
// UPDATE RESOURCE
// ========================================

export const updateResource =
    async (
        id,
        resourceData
    ) => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                resourceData
            );


        return response.data;

    };


// ========================================
// DELETE RESOURCE
// ========================================

export const deleteResource =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );


        return response.data;

    };