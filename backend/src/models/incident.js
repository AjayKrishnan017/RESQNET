import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        disasterType: {
            type: String,
            required: true,
            enum: [
                "FLOOD",
                "EARTHQUAKE",
                "FIRE",
                "LANDSLIDE",
                "CYCLONE",
                "TSUNAMI",
                "OTHER"
            ]
        },

        severity: {
            type: String,
            required: true,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "MEDIUM"
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        peopleAffected: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "IN_PROGRESS",
                "RESOLVED"
            ],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;