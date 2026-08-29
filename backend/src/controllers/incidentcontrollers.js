import Incident from "../models/incident.js";

// CREATE INCIDENT
export const createIncident = async (req, res) => {
    try {
        const incident = await Incident.create(req.body);

        res.status(201).json({
            success: true,
            message: "Incident created successfully",
            incident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create incident",
            error: error.message
        });
    }
};

// GET ALL INCIDENTS
export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: incidents.length,
            incidents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch incidents",
            error: error.message
        });
    }
};

// GET SINGLE INCIDENT
export const getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        res.status(200).json({
            success: true,
            incident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch incident",
            error: error.message
        });
    }
};

// UPDATE INCIDENT
export const updateIncident = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Incident updated successfully",
            incident
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update incident",
            error: error.message
        });
    }
};

// DELETE INCIDENT
export const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndDelete(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Incident deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete incident",
            error: error.message
        });
    }
};