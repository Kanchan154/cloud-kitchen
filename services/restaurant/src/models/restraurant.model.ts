import mongoose, { Document, Schema } from "mongoose";

// interface for the Schema
export interface IRestaurant extends Document {
    name: string;
    description: string;
    image: string;
    ownerId: string;
    phone: number;
    isVerified: boolean;
    autoLocation: {
        type: "Point",
        coordinates: [number, number];
        formattedAddress: string;
    };
    isOpen: boolean;
    createdAt: Date;
}

// restaurant Schema
const RestaurantSchema = new mongoose.Schema<IRestaurant>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    autoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        formattedAddress: {
            type: String,
            required: true,
        },
    },
    isOpen: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

RestaurantSchema.index({ autoLocation: "2dsphere" });

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
