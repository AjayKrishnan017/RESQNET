import mongoose from "mongoose";

const responderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        teamName: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            enum: [
                "MEDICAL",
                "FIRE_RESCUE",
                "POLICE",
                "SEARCH_RESCUE",
                "DRONE_OPERATOR",
                "VOLUNTEER",
                "OTHER"
            ]
        },

        skills: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "AVAILABLE",
                "DEPLOYED",
                "OFF_DUTY"
            ],
            default: "AVAILABLE"
        },

        location: {
            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        assignedIncident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Incident",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Responder =
    mongoose.model(
        "Responder",
        responderSchema
    );

export default Responder;