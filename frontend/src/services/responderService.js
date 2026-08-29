import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/responders`;


// ========================================
// GET RESPONDERS
// ========================================

export const getResponders =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// GET RESPONDER
// ========================================

export const getResponderById =
    async (id) => {

        const response =
            await axios.get(
                `${API_URL}/${id}`
            );


        return response.data;

    };


// ========================================
// CREATE RESPONDER
// ========================================

export const createResponder =
    async (responderData) => {

        const response =
            await axios.post(
                API_URL,
                responderData
            );


        return response.data;

    };


// ========================================
// UPDATE RESPONDER
// ========================================

export const updateResponder =
    async (
        id,
        responderData
    ) => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                responderData
            );


        return response.data;

    };


// ========================================
// DELETE RESPONDER
// ========================================

export const deleteResponder =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );


        return response.data;

    };