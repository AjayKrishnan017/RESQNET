import axios from "axios";

import {
    API_BASE_URL
} from "../config/api.js";


const API_URL =
    `${API_BASE_URL}/api/users`;


// ========================================
// GET USERS
// ========================================

export const getUsers =
    async () => {

        const response =
            await axios.get(
                API_URL
            );


        return response.data;

    };


// ========================================
// CREATE USER
// ========================================

export const createUser =
    async (userData) => {

        const response =
            await axios.post(
                API_URL,
                userData
            );


        return response.data;

    };


// ========================================
// UPDATE ROLE
// ========================================

export const updateUserRole =
    async (
        id,
        role
    ) => {

        const response =
            await axios.patch(
                `${API_URL}/${id}/role`,
                {
                    role
                }
            );


        return response.data;

    };


// ========================================
// ENABLE / DISABLE
// ========================================

export const updateUserStatus =
    async (
        id,
        isActive
    ) => {

        const response =
            await axios.patch(
                `${API_URL}/${id}/status`,
                {
                    isActive
                }
            );


        return response.data;

    };


// ========================================
// DELETE USER
// ========================================

export const deleteUser =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );


        return response.data;

    };