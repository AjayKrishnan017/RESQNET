import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";


// ========================================
// TOKEN
// ========================================

const generateToken = (
    user
) => {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }
    );

};


// ========================================
// REGISTER
// ========================================

export const register =
    async (req, res) => {

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
                !password
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Name, email and password are required."
                    });

            }


            const existingUser =
                await User.findOne({
                    email:
                        email.toLowerCase()
                });


            if (existingUser) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "User already exists."
                    });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );


            const user =
                await User.create({
                    name,
                    email:
                        email.toLowerCase(),

                    password:
                        hashedPassword,

                    role:
                        role ||
                        "DISPATCHER"
                });


            const token =
                generateToken(
                    user
                );


            res.status(201).json({

                success: true,

                token,

                user: {
                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role
                }

            });

        } catch (error) {

            console.error(
                "Register error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Registration failed."
            });

        }

    };


// ========================================
// LOGIN
// ========================================

export const login =
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (
                !email ||
                !password
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Email and password are required."
                    });

            }


            const user =
                await User.findOne({
                    email:
                        email.toLowerCase()
                }).select(
                    "+password"
                );


            if (!user) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid email or password."
                    });

            }


            if (!user.isActive) {

                return res
                    .status(403)
                    .json({
                        success: false,
                        message:
                            "Account is disabled."
                    });

            }


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid email or password."
                    });

            }


            const token =
                generateToken(
                    user
                );


            res.status(200).json({

                success: true,

                token,

                user: {
                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role
                }

            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Login failed."
            });

        }

    };


// ========================================
// CURRENT USER
// ========================================

export const getCurrentUser =
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                ).select(
                    "-password"
                );


            if (!user) {

                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "User not found."
                    });

            }


            res.status(200).json({
                success: true,
                user
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    "Failed to load user."
            });

        }

    };