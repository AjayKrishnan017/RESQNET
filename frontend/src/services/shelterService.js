import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/shelters`;


// ========================================
// GET SHELTERS
// ========================================

export const getShelters =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// CREATE SHELTER
// ========================================

export const createShelter =
    async (shelterData) => {

        const response =
            await axios.post(
                API_URL,
                shelterData
            );


        return response.data;

    };


// ========================================
// UPDATE SHELTER
// ========================================

export const updateShelter =
    async (
        id,
        shelterData
    ) => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                shelterData
            );


        return response.data;

    };


// ========================================
// DELETE SHELTER
// ========================================

export const deleteShelter =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );


        return response.data;

    };