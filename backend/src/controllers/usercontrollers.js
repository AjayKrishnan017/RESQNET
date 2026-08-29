import bcrypt from "bcryptjs";

import User from "../models/user.js";


const ALLOWED_ROLES = [
    "ADMIN",
    "DISPATCHER",
    "RESPONDER",
    "SHELTER_MANAGER"
];


// ========================================
// GET ALL USERS
// ========================================

export const getUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({
                createdAt: -1
            });


        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to load users."
        });

    }

};


// ========================================
// CREATE USER
// ========================================

export const createUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        if (
            !name ||
            !email ||
            !password ||
            !role
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email, password and role are required."
            });

        }


        if (
            password.length < 6
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters."
            });

        }


        if (
            !ALLOWED_ROLES.includes(
                role
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid user role."
            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "A user with this email already exists."
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        const user =
            await User.create({

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                password:
                    hashedPassword,

                role
            });


        res.status(201).json({

            success: true,

            message:
                "User created successfully.",

            user: {

                _id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                isActive:
                    user.isActive,

                createdAt:
                    user.createdAt
            }

        });

    } catch (error) {

        console.error(
            "Create user error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create user."
        });

    }

};


// ========================================
// UPDATE ROLE
// ========================================

export const updateUserRole =
    async (req, res) => {

        try {

            const {
                role
            } = req.body;


            if (
                !ALLOWED_ROLES.includes(
                    role
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid user role."
                });

            }


            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {

                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });

            }


            // Prevent admin accidentally
            // removing their own admin access.

            if (
                user._id.toString() ===
                    req.user.id &&
                role !== "ADMIN"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You cannot remove your own ADMIN role."
                });

            }


            user.role =
                role;


            await user.save();


            res.status(200).json({

                success: true,

                message:
                    "User role updated.",

                user: {
                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    isActive:
                        user.isActive
                }

            });

        } catch (error) {

            console.error(
                "Update role error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Failed to update user role."
            });

        }

    };


// ========================================
// ENABLE / DISABLE USER
// ========================================

export const updateUserStatus =
    async (req, res) => {

        try {

            const {
                isActive
            } = req.body;


            if (
                typeof isActive !==
                "boolean"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "isActive must be true or false."
                });

            }


            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {

                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });

            }


            if (
                user._id.toString() ===
                    req.user.id &&
                isActive === false
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You cannot disable your own account."
                });

            }


            user.isActive =
                isActive;


            await user.save();


            res.status(200).json({

                success: true,

                message:
                    isActive
                        ? "User enabled."
                        : "User disabled.",

                user: {
                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    isActive:
                        user.isActive
                }

            });

        } catch (error) {

            console.error(
                "Update status error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Failed to update account status."
            });

        }

    };


// ========================================
// DELETE USER
// ========================================

export const deleteUser =
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {

                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });

            }


            if (
                user._id.toString() ===
                req.user.id
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "You cannot delete your own account."
                });

            }


            await user.deleteOne();


            res.status(200).json({
                success: true,
                message:
                    "User deleted successfully."
            });

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Failed to delete user."
            });

        }

    };