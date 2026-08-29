import Shelter from "../models/shelter.js";


export const createShelter = async (req, res) => {
    try {
        const shelter =
            await Shelter.create(
                req.body
            );

        res.status(201).json({
            success: true,
            shelter
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to create shelter"
        });
    }
};


export const getShelters = async (req, res) => {
    try {
        const shelters =
            await Shelter.find()
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            shelters
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to load shelters"
        });
    }
};


export const updateShelter = async (req, res) => {
    try {
        const shelter =
            await Shelter.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!shelter) {
            return res.status(404).json({
                success: false,
                message:
                    "Shelter not found"
            });
        }

        res.json({
            success: true,
            shelter
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message
        });
    }
};


export const deleteShelter = async (req, res) => {
    try {
        const shelter =
            await Shelter.findByIdAndDelete(
                req.params.id
            );

        if (!shelter) {
            return res.status(404).json({
                success: false,
                message:
                    "Shelter not found"
            });
        }

        res.json({
            success: true,
            message:
                "Shelter deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to delete shelter"
        });
    }
};