import mongoose from "mongoose";

const auditLogSchema =
    new mongoose.Schema(
        {
            actor: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            actorName: {
                type: String,
                default: "System"
            },

            actorEmail: {
                type: String,
                default: ""
            },

            actorRole: {
                type: String,
                default: "SYSTEM"
            },

            action: {
                type: String,
                required: true
            },

            entityType: {
                type: String,
                required: true
            },

            entityId: {
                type: String,
                default: null
            },

            description: {
                type: String,
                required: true
            },

            method: {
                type: String,
                default: ""
            },

            path: {
                type: String,
                default: ""
            },

            statusCode: {
                type: Number
            },

            metadata: {
                type: mongoose.Schema.Types.Mixed,
                default: {}
            }
        },

        {
            timestamps: true
        }
    );


auditLogSchema.index({
    createdAt: -1
});


const AuditLog =
    mongoose.model(
        "AuditLog",
        auditLogSchema
    );


export default AuditLog;