import Responder from "../models/responder.js";


// =============================
// CREATE RESPONDER
// =============================

export const createResponder = async (req, res) => {
    try {
        const responder =
            await Responder.create(req.body);

        res.status(201).json({
            success: true,
            responder
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to create responder"
        });
    }
};


// =============================
// GET RESPONDERS
// =============================

export const getResponders = async (req, res) => {
    try {
        const responders =
            await Responder.find()
                .populate(
                    "assignedIncident",
                    "title severity status"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            responders
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to load responders"
        });
    }
};


// =============================
// GET RESPONDER
// =============================

export const getResponderById = async (req, res) => {
    try {
        const responder =
            await Responder.findById(
                req.params.id
            ).populate(
                "assignedIncident",
                "title severity status"
            );

        if (!responder) {
            return res.status(404).json({
                success: false,
                message:
                    "Responder not found"
            });
        }

        res.status(200).json({
            success: true,
            responder
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to load responder"
        });
    }
};


// =============================
// UPDATE RESPONDER
// =============================

export const updateResponder = async (req, res) => {
    try {
        const responder =
            await Responder.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!responder) {
            return res.status(404).json({
                success: false,
                message:
                    "Responder not found"
            });
        }

        res.status(200).json({
            success: true,
            responder
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to update responder"
        });
    }
};


// =============================
// DELETE RESPONDER
// =============================

export const deleteResponder = async (req, res) => {
    try {
        const responder =
            await Responder.findByIdAndDelete(
                req.params.id
            );

        if (!responder) {
            return res.status(404).json({
                success: false,
                message:
                    "Responder not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Responder deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to delete responder"
        });
    }
};