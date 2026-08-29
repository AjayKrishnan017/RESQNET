import Incident from "../models/incident.js";
import Responder from "../models/responder.js";


// ========================================
// ASSIGN RESPONDER TO INCIDENT
// ========================================

export const assignResponder = async (req, res) => {

    try {

        const {
            incidentId,
            responderId
        } = req.body;


        if (!incidentId || !responderId) {

            return res.status(400).json({
                success: false,
                message:
                    "Incident ID and responder ID are required."
            });

        }


        // CHECK INCIDENT

        const incident =
            await Incident.findById(
                incidentId
            );


        if (!incident) {

            return res.status(404).json({
                success: false,
                message:
                    "Incident not found."
            });

        }


        // CHECK RESPONDER

        const responder =
            await Responder.findById(
                responderId
            );


        if (!responder) {

            return res.status(404).json({
                success: false,
                message:
                    "Responder not found."
            });

        }


        // RESPONDER ALREADY DEPLOYED

        if (
            responder.status === "DEPLOYED" &&
            responder.assignedIncident
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Responder is already deployed."
            });

        }


        // OFF DUTY CANNOT DEPLOY

        if (
            responder.status === "OFF_DUTY"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Off-duty responder cannot be deployed."
            });

        }


        responder.status =
            "DEPLOYED";

        responder.assignedIncident =
            incidentId;


        await responder.save();


        await responder.populate(
            "assignedIncident",
            "title severity status disasterType"
        );


        res.status(200).json({

            success: true,

            message:
                "Responder successfully deployed.",

            responder

        });


    } catch (error) {

        console.error(
            "Assign responder error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to assign responder."

        });

    }

};


// ========================================
// RELEASE RESPONDER
// ========================================

export const releaseResponder = async (
    req,
    res
) => {

    try {

        const {
            responderId
        } = req.body;


        if (!responderId) {

            return res.status(400).json({
                success: false,
                message:
                    "Responder ID is required."
            });

        }


        const responder =
            await Responder.findById(
                responderId
            );


        if (!responder) {

            return res.status(404).json({
                success: false,
                message:
                    "Responder not found."
            });

        }


        responder.status =
            "AVAILABLE";

        responder.assignedIncident =
            null;


        await responder.save();


        res.status(200).json({

            success: true,

            message:
                "Responder released successfully.",

            responder

        });


    } catch (error) {

        console.error(
            "Release responder error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to release responder."

        });

    }

};