import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "FOOD",
                "WATER",
                "MEDICAL",
                "EQUIPMENT",
                "CLOTHING",
                "FUEL",
                "OTHER"
            ]
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        unit: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "AVAILABLE",
                "LOW_STOCK",
                "OUT_OF_STOCK"
            ],
            default: "AVAILABLE"
        }
    },
    {
        timestamps: true
    }
);

const Resource =
    mongoose.model(
        "Resource",
        resourceSchema
    );

export default Resource;