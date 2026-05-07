import mongoose, { Document, Schema } from "mongoose";

export interface IAddress extends Document {
    userId: string;
    mobile: number;

    formattedAddress: string;

    location: {
        type: "Point";
        coordinates: [number, number];
    };
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new mongoose.Schema<IAddress>({
    userId: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    formattedAddress: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { timestamps: true });

const AddressModel = mongoose.model<IAddress>("Address", AddressSchema);
export default AddressModel;