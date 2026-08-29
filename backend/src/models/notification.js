import mongoose from "mongoose";

const notificationSchema =
    new mongoose.Schema(
        {
            title: {
                type: String,
                required: true
            },

            message: {
                type: String,
                required: true
            },

            type: {
                type: String,

                enum: [
                    "INFO",
                    "SUCCESS",
                    "WARNING",
                    "CRITICAL"
                ],

                default: "INFO"
            },

            targetRoles: [
                {
                    type: String,

                    enum: [
                        "ADMIN",
                        "DISPATCHER",
                        "RESPONDER",
                        "SHELTER_MANAGER"
                    ]
                }
            ],

            relatedEntityType: {
                type: String,
                default: null
            },

            relatedEntityId: {
                type: String,
                default: null
            },

            readBy: [
                {
                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "User"
                }
            ]
        },

        {
            timestamps: true
        }
    );


notificationSchema.index({
    createdAt: -1
});


const Notification =
    mongoose.model(
        "Notification",
        notificationSchema
    );


export default Notification;