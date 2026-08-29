import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 0
        },

        occupied: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "OPEN",
                "FULL",
                "CLOSED"
            ],
            default: "OPEN"
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

        contactNumber: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Shelter =
    mongoose.model(
        "Shelter",
        shelterSchema
    );

export default Shelter;