import Resource from "../models/resource.js";


export const createResource = async (req, res) => {
    try {
        const resource =
            await Resource.create(
                req.body
            );

        res.status(201).json({
            success: true,
            resource
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to create resource"
        });
    }
};


export const getResources = async (req, res) => {
    try {
        const resources =
            await Resource.find()
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            resources
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to load resources"
        });
    }
};


export const updateResource = async (req, res) => {
    try {
        const resource =
            await Resource.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message:
                    "Resource not found"
            });
        }

        res.json({
            success: true,
            resource
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message
        });
    }
};


export const deleteResource = async (req, res) => {
    try {
        const resource =
            await Resource.findByIdAndDelete(
                req.params.id
            );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message:
                    "Resource not found"
            });
        }

        res.json({
            success: true,
            message:
                "Resource deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to delete resource"
        });
    }
};